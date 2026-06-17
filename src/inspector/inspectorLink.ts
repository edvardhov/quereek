import { ApolloLink } from '@apollo/client'
import { getOperationAST, print } from 'graphql'
import { tap } from 'rxjs'

import { recordOperation, updateOperation } from '@/inspector/store'

export const inspectorLink = new ApolloLink((operation, forward) => {
  const startedAt = Date.now()
  const ast = getOperationAST(operation.query)
  const name = ast?.name?.value ?? 'Anonymous'
  const type = (ast?.operation ?? 'query') as 'query' | 'mutation' | 'subscription'
  const document = print(operation.query)
  const variables = (operation.variables ?? {}) as Record<string, unknown>

  const id = recordOperation({
    id: crypto.randomUUID(),
    type,
    name,
    document,
    variables,
    startedAt,
  })

  return forward(operation).pipe(
    tap({
      next: (result) => {
        const errors = 'errors' in result ? result.errors : undefined
        updateOperation(id, {
          status: errors?.length ? 'error' : 'success',
          response: 'data' in result ? result.data : undefined,
          errors: errors?.map((error) => ({ message: error.message })),
          durationMs: Date.now() - startedAt,
        })
      },
      error: () => {
        updateOperation(id, {
          status: 'error',
          durationMs: Date.now() - startedAt,
        })
      },
    }),
  )
})
