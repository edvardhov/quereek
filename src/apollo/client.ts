import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  split,
} from '@apollo/client'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { getMainDefinition } from '@apollo/client/utilities'
import { createClient } from 'graphql-ws'

const httpUri = '/graphql'

const httpLink = new HttpLink({ uri: httpUri })

function createWsLink() {
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
  const wsUri = `${protocol}//${window.location.host}/graphql`

  return new GraphQLWsLink(
    createClient({
      url: wsUri,
    }),
  )
}

const wsLink = typeof window !== 'undefined' ? createWsLink() : null

const link =
  wsLink == null
    ? httpLink
    : split(
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

export const client = new ApolloClient({
  link,
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
