import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
  split,
} from '@apollo/client'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { getMainDefinition } from '@apollo/client/utilities'
import { createClient } from 'graphql-ws'

import { resolveEndpoint } from '@/config/endpoint'
import { createLocalSchemaLink } from '@/demo/localSchemaLink'
import { inspectorLink } from '@/inspector/inspectorLink'

function createTransportLink(): ApolloLink {
  const endpoint = resolveEndpoint()

  // No server configured: run the schema in the browser (demo mode).
  if (!endpoint) {
    return createLocalSchemaLink()
  }

  const httpLink = new HttpLink({ uri: endpoint.http })
  const wsLink = new GraphQLWsLink(createClient({ url: endpoint.ws }))

  return split(
    ({ query }) => {
      const definition = getMainDefinition(query)
      return (
        definition.kind === 'OperationDefinition' &&
        definition.operation === 'subscription'
      )
    },
    wsLink,
    httpLink,
  )
}

export const client = new ApolloClient({
  link: ApolloLink.from([inspectorLink, createTransportLink()]),
  cache: new InMemoryCache({
    typePolicies: {
      Project: {
        fields: {
          tasks: {
            merge(_existing, incoming) {
              return incoming
            },
          },
        },
      },
    },
  }),
})
