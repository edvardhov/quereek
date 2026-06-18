import { ApolloLink } from '@apollo/client'
import type { FetchResult } from '@apollo/client'
import { execute, getOperationAST, subscribe } from 'graphql'
import type { ExecutionResult } from 'graphql'
import { makeExecutableSchema } from '@graphql-tools/schema'
import { Observable } from 'rxjs'

import typeDefs from '../../server/schema.graphql?raw'
import { resolvers } from '../../server/src/resolvers'

const schema = makeExecutableSchema({ typeDefs, resolvers })

function isAsyncIterable<T>(value: unknown): value is AsyncIterable<T> {
  return (
    value != null &&
    typeof (value as AsyncIterable<T>)[Symbol.asyncIterator] === 'function'
  )
}

/**
 * A terminating Apollo link that runs operations against the bundled schema in
 * the browser — no server required. Queries and mutations go through graphql's
 * `execute`; subscriptions through `subscribe`, streaming each event from the
 * in-memory PubSub. This powers the free, always-on live demo.
 */
export function createLocalSchemaLink(): ApolloLink {
  return new ApolloLink(
    (operation) =>
      new Observable<FetchResult>((subscriber) => {
        let cancelled = false
        let iterator: AsyncIterator<ExecutionResult> | null = null

        const run = async () => {
          const args = {
            schema,
            document: operation.query,
            variableValues: operation.variables,
            operationName: operation.operationName,
          }
          const ast = getOperationAST(operation.query, operation.operationName)

          if (ast?.operation === 'subscription') {
            const result = await subscribe(args)
            if (isAsyncIterable<ExecutionResult>(result)) {
              iterator = result[Symbol.asyncIterator]()
              while (!cancelled) {
                const { value, done } = await iterator.next()
                if (done) break
                subscriber.next(value as FetchResult)
              }
              if (!cancelled) subscriber.complete()
            } else {
              subscriber.next(result as FetchResult)
              subscriber.complete()
            }
            return
          }

          const result = await execute(args)
          subscriber.next(result as FetchResult)
          subscriber.complete()
        }

        run().catch((error) => {
          if (!cancelled) subscriber.error(error)
        })

        return () => {
          cancelled = true
          void iterator?.return?.()
        }
      }),
  )
}
