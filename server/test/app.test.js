import assert from 'node:assert/strict'
import { after, before, test } from 'node:test'
import { createApp } from '../src/app.js'

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

const pool = {
    async query(sql, values = []) {
        if (!databaseAvailable) throw new Error('Database unavailable')
        if (sql === 'SELECT 1') return [[{ 1: 1 }]]
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
