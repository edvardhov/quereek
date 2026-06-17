import http from 'node:http'
import express from 'express'
import cors from 'cors'
import { ApolloServer } from '@apollo/server'
import { expressMiddleware } from '@as-integrations/express4'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import { makeExecutableSchema } from '@graphql-tools/schema'
import { WebSocketServer } from 'ws'
import { useServer } from 'graphql-ws/use/ws'
import { typeDefs } from './schema.js'
import { resolvers } from './resolvers.js'

const PORT = Number(process.env.PORT ?? 4000)

const schema = makeExecutableSchema({ typeDefs, resolvers })

const app = express()
const httpServer = http.createServer(app)

const server = new ApolloServer({
  schema,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
})

await server.start()

const wsServer = new WebSocketServer({
  server: httpServer,
  path: '/graphql',
})

const serverCleanup = useServer({ schema }, wsServer)

app.use(
  '/graphql',
  cors<cors.CorsRequest>(),
  express.json(),
  expressMiddleware(server),
)

httpServer.listen(PORT, () => {
  console.log(`Quereek GraphQL server ready at http://localhost:${PORT}/graphql`)
})

process.on('SIGTERM', async () => {
  await serverCleanup.dispose()
  await server.stop()
  httpServer.close()
})
