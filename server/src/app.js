import cors from 'cors'
import express from 'express'
import bcrypt from 'bcryptjs'
import { authenticate, signToken } from './auth.js'

export function createApp(pool) {
    const app = express()
    const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:5173')
        .split(',')
        .map((origin) => origin.trim())
        .filter(Boolean)

    app.use(cors({
        origin(origin, callback) {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true)
                return
            }
            callback(new Error('Origin is not allowed by CORS.'))
        },
    }))
    app.use(express.json())

    app.get('/api/health', async (_request, response) => {
        try {
            await pool.query('SELECT 1')
            response.json({ status: 'ok', database: 'connected' })
        } catch {
            response.status(503).json({ status: 'error', database: 'unavailable' })
        }
    })

    app.get('/api/categories', async (_request, response) => {
        const [categories] = await pool.query(
            'SELECT slug, name FROM categories ORDER BY name',
        )
        response.json(categories)
    })

    app.get('/api/articles', async (_request, response) => {
        const [articles] = await pool.query(
            `SELECT id, slug, title, summary, content, image, author,
                    category_slug AS category, published_at AS publishedAt, featured
             FROM articles
             ORDER BY published_at DESC, id DESC`,
        )
        response.json(articles)
    })

    app.get('/api/articles/:id', async (request, response) => {
        const id = Number(request.params.id)
        if (!Number.isSafeInteger(id) || id < 1) {
            return response.status(400).json({
                message: 'Article id must be a positive integer.',
            })
        }

        const [articles] = await pool.query(
            `SELECT id, slug, title, summary, content, image, author,
                    category_slug AS category, published_at AS publishedAt, featured
             FROM articles
             WHERE id = ?`,
            [id],
        )

        if (articles.length === 0) {
            return response.status(404).json({ message: 'Article not found.' })
        }

        response.json(articles[0])
    })

    //dăng ký
    app.post('/api/auth/register', async (request, response) => {
        const { username, password, fullName } = request.body ?? {}
        const name = String(username ?? '').trim()
        const display = String(fullName ?? '').trim()

        if (!/^[a-zA-Z0-9_]{3,30}$/.test(name)) {
            return response.status(400).json({ message: 'Tên đăng nhập gồm 3-30 ký tự chữ, số hoặc dấu gạch dưới.' })
        }
        if (typeof password !== 'string' || password.length < 6) {
            return response.status(400).json({ message: 'Mật khẩu phải có ít nhất 6 ký tự.' })
        }
        if (!display || display.length > 100) {
            return response.status(400).json({ message: 'Vui lòng nhập họ tên (tối đa 100 ký tự).' })
        }

        const passwordHash = await bcrypt.hash(password, 10)
        try {
            const [result] = await pool.query(
                'INSERT INTO users (username, password_hash, full_name) VALUES (?, ?, ?)',
                [name, passwordHash, display],
            )
            const user = { id: result.insertId, username: name, fullName: display }
            response.status(201).json({ token: signToken(user), user })
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                return response.status(409).json({ message: 'Tên đăng nhập đã tồn tại.' })
            }
            throw error
        }
    })

    app.use((request, response) => {
        response.status(404).json({ message: `Route not found: ${request.method} ${request.path}` })
    })

    app.use((error, _request, response, _next) => {
        if (response.headersSent) {
            return
        }
        if (error.type === 'entity.parse.failed') {
            response.status(400).json({ message: 'Request body must contain valid JSON.' })
            return
        }
        if (error.message === 'Origin is not allowed by CORS.') {
            response.status(403).json({ message: 'Origin is not allowed.' })
            return
        }
        console.error('API request failed:', error)
        response.status(500).json({ message: 'Internal server error.' })
    })

    return app
}
