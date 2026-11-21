import cors from 'cors'
import express from 'express'

export function createApp(pool) {
    const app = express()

    app.use(cors({
        origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    }))
    app.use(express.json())

    app.get('/api/health', async (_request, response) => {
        await pool.query('SELECT 1')
        response.json({ status: 'ok', database: 'connected' })
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
                    category_slug AS category, published_at, featured
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
                    category_slug AS category, published_at, featured
             FROM articles
             WHERE id = ?`,
            [id],
        )

        if (articles.length === 0) {
            return response.status(404).json({ message: 'Article not found.' })
        }

        response.json(articles[0])
    })

    app.use((request, response) => {
        response.status(404).json({ message: `Route not found: ${request.method} ${request.path}` })
    })

    app.use((error, _request, response, _next) => {
        console.error('API request failed:', error)
        response.status(500).json({ message: 'Internal server error.' })
    })

    return app
}
