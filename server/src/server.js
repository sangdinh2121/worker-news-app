import 'dotenv/config'
import { createApp } from './app.js'
import { createPool } from './database.js'

const port = Number(process.env.PORT || 3001)
if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error('PORT must be an integer between 1 and 65535.')
}

const pool = createPool()
const server = createApp(pool).listen(port, () => {
    console.log(`Worker News API listening on http://localhost:${port}`)
})

async function shutdown() {
    server.close(async () => {
        await pool.end()
        process.exit(0)
    })
}

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)
