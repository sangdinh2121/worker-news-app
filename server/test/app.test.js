import assert from 'node:assert/strict'
import { after, before, test } from 'node:test'
import { createApp } from '../src/app.js'
import { signToken } from '../src/auth.js'

const article = {
    id: 2,
    slug: 'doi-tuyen-thang-dam',
    title: 'Đội tuyển thắng đậm trận mở màn',
    category: 'the-thao',
}

let databaseAvailable = true
let server
let baseUrl
const originalFrontendUrl = process.env.FRONTEND_URL
const originalJwtSecret = process.env.JWT_SECRET
const comments = []

const pool = {
    async query(sql, values = []) {
        if (!databaseAvailable) throw new Error('Database unavailable')
        if (sql === 'SELECT 1') return [[{ 1: 1 }]]
        if (sql === 'SELECT id FROM articles WHERE id = ?') {
            return [values[0] === article.id ? [{ id: article.id }] : []]
        }
        if (sql.startsWith('INSERT INTO comments')) {
            const [articleId, userId, content] = values
            const comment = {
                id: comments.length + 1,
                articleId,
                userId,
                content,
                author: 'Người đọc',
                createdAt: '2026-11-28T00:00:00.000Z',
            }
            comments.push(comment)
            return [{ insertId: comment.id }]
        }
        if (sql.includes('FROM comments')) {
            const matchingComments = sql.includes('WHERE comments.id = ?')
                ? comments.filter((comment) => comment.id === values[0])
                : comments.filter((comment) => comment.articleId === values[0])
            return [matchingComments.map(({ id, articleId, content, createdAt, author }) => ({
                id,
                articleId,
                content,
                createdAt,
                author,
            }))]
        }
        if (sql.includes('FROM categories')) {
            return [[{ slug: 'the-thao', name: 'Thể thao' }]]
        }
        if (sql.includes('FROM articles') && sql.includes('WHERE id = ?')) {
            return [values[0] === article.id ? [article] : []]
        }
        if (sql.includes('FROM articles')) return [[article]]
        throw new Error('Unexpected query')
    },
}

before(async () => {
    process.env.FRONTEND_URL = 'http://allowed.example'
    process.env.JWT_SECRET = 'test-secret-for-api-tests'
    server = createApp(pool).listen(0, '127.0.0.1')
    await new Promise((resolve) => server.once('listening', resolve))
    baseUrl = `http://127.0.0.1:${server.address().port}`
})

after(async () => {
    try {
        await new Promise((resolve, reject) => {
            server.close((error) => error ? reject(error) : resolve())
        })
    } finally {
        if (originalFrontendUrl === undefined) delete process.env.FRONTEND_URL
        else process.env.FRONTEND_URL = originalFrontendUrl
        if (originalJwtSecret === undefined) delete process.env.JWT_SECRET
        else process.env.JWT_SECRET = originalJwtSecret
    }
})

test('health endpoint reports database availability', async () => {
    const response = await fetch(`${baseUrl}/api/health`)
    assert.equal(response.status, 200)
    assert.deepEqual(await response.json(), { status: 'ok', database: 'connected' })

    databaseAvailable = false
    const unavailableResponse = await fetch(`${baseUrl}/api/health`)
    assert.equal(unavailableResponse.status, 503)
    assert.deepEqual(await unavailableResponse.json(), {
        status: 'error',
        database: 'unavailable',
    })
    databaseAvailable = true
})

test('category and article endpoints return database records', async () => {
    const categoriesResponse = await fetch(`${baseUrl}/api/categories`)
    assert.equal(categoriesResponse.status, 200)
    assert.deepEqual(await categoriesResponse.json(), [
        { slug: 'the-thao', name: 'Thể thao' },
    ])

    const articlesResponse = await fetch(`${baseUrl}/api/articles`)
    assert.equal(articlesResponse.status, 200)
    assert.deepEqual(await articlesResponse.json(), [article])
})

test('article detail validates ids and reports missing records', async () => {
    const articleResponse = await fetch(`${baseUrl}/api/articles/${article.id}`)
    assert.equal(articleResponse.status, 200)
    assert.deepEqual(await articleResponse.json(), article)

    const invalidResponse = await fetch(`${baseUrl}/api/articles/not-a-number`)
    assert.equal(invalidResponse.status, 400)

    const missingResponse = await fetch(`${baseUrl}/api/articles/99`)
    assert.equal(missingResponse.status, 404)
})

test('comments can be read publicly and require an authenticated valid submission', async () => {
    const commentsUrl = `${baseUrl}/api/articles/${article.id}/comments`
    const emptyResponse = await fetch(commentsUrl)
    assert.equal(emptyResponse.status, 200)
    assert.deepEqual(await emptyResponse.json(), [])

    const missingArticleResponse = await fetch(`${baseUrl}/api/articles/99/comments`)
    assert.equal(missingArticleResponse.status, 404)

    const unauthorizedResponse = await fetch(commentsUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: 'Hello' }),
    })
    assert.equal(unauthorizedResponse.status, 401)

    const token = signToken({ id: 7, username: 'reader', fullName: 'Người đọc' })
    const invalidResponse = await fetch(commentsUrl, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: '   ' }),
    })
    assert.equal(invalidResponse.status, 400)

    const createdResponse = await fetch(commentsUrl, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: '  Bài viết rất hữu ích.  ' }),
    })
    assert.equal(createdResponse.status, 201)
    assert.deepEqual(await createdResponse.json(), {
        id: 1,
        articleId: article.id,
        content: 'Bài viết rất hữu ích.',
        createdAt: '2026-11-28T00:00:00.000Z',
        author: 'Người đọc',
    })

    const populatedResponse = await fetch(commentsUrl)
    assert.equal(populatedResponse.status, 200)
    assert.equal((await populatedResponse.json()).length, 1)
})

test('unknown routes and disallowed browser origins are rejected', async () => {
    const notFoundResponse = await fetch(`${baseUrl}/api/missing`)
    assert.equal(notFoundResponse.status, 404)

    const allowedResponse = await fetch(`${baseUrl}/api/health`, {
        headers: { Origin: 'http://allowed.example' },
    })
    assert.equal(allowedResponse.headers.get('access-control-allow-origin'), 'http://allowed.example')

    const blockedResponse = await fetch(`${baseUrl}/api/health`, {
        headers: { Origin: 'http://blocked.example' },
    })
    assert.equal(blockedResponse.status, 403)
})
