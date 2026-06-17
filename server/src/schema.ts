import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export const typeDefs = readFileSync(
  path.join(__dirname, '../schema.graphql'),
  'utf-8',
)
