import { spawn, type ChildProcess } from 'node:child_process'
import { watch } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const serverEntry = path.join(__dirname, 'src/index.ts')
const schemaFile = path.join(__dirname, 'schema.graphql')
const srcDir = path.join(__dirname, 'src')

let child: ChildProcess | null = null
let restartTimer: ReturnType<typeof setTimeout> | undefined

function startServer() {
  child?.kill('SIGTERM')
  child = spawn(process.execPath, ['--import', 'tsx', serverEntry], {
    stdio: 'inherit',
    env: process.env,
  })
  child.on('exit', (code, signal) => {
    if (signal !== 'SIGTERM' && signal !== 'SIGINT') {
      process.exit(code ?? 1)
    }
  })
}

function scheduleRestart(reason: string) {
  clearTimeout(restartTimer)
  restartTimer = setTimeout(() => {
    console.log(`[dev] Restarting server (${reason})…`)
    startServer()
  }, 150)
}

startServer()

watch(schemaFile, () => scheduleRestart('schema.graphql changed'))
watch(srcDir, { recursive: true }, () => scheduleRestart('server/src changed'))

function shutdown() {
  child?.kill('SIGTERM')
  process.exit(0)
}

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)
