import mysql from 'mysql2/promise'

const requiredVariables = ['DB_HOST', 'DB_NAME', 'DB_USER']

export function createPool() {
    const missingVariables = requiredVariables.filter((name) => !process.env[name])
    if (missingVariables.length > 0) {
        throw new Error(`Missing database configuration: ${missingVariables.join(', ')}`)
    }

    const port = Number(process.env.DB_PORT || 3306)
    if (!Number.isInteger(port) || port < 1 || port > 65535) {
        throw new Error('DB_PORT must be an integer between 1 and 65535.')
    }

    return mysql.createPool({
        host: process.env.DB_HOST,
        port,
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD || '',
        waitForConnections: true,
        connectionLimit: 10,
        connectTimeout: 10000,
        ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: true } : undefined,
    })
}
