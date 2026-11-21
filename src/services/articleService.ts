
import axios from 'axios'
import type { Article } from '../types/article'
import type { Category, CategorySlug } from '../types/category'

const articleClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
})

const categorySlugs: CategorySlug[] = [
    'thoi-su',
    'the-gioi',
    'kinh-doanh',
    'cong-nghe',
    'the-thao',
    'giai-tri',
]

function isCategorySlug(value: unknown): value is CategorySlug {
    return typeof value === 'string' && categorySlugs.includes(value as CategorySlug)
}

function mapArticle(value: unknown): Article {
    if (typeof value !== 'object' || value === null) {
        throw new Error('API trả về dữ liệu bài viết không hợp lệ.')
    }

    const article = value as Record<string, unknown>
    if (
        typeof article.id !== 'number' ||
        typeof article.title !== 'string' ||
        typeof article.slug !== 'string' ||
        !isCategorySlug(article.category) ||
        typeof article.summary !== 'string' ||
        typeof article.published_at !== 'string'
    ) {
        throw new Error('API trả về dữ liệu bài viết không hợp lệ.')
    }

    return {
        id: article.id,
        title: article.title,
        slug: article.slug,
        category: article.category,
        summary: article.summary,
        image: typeof article.image === 'string' && article.image
            ? article.image
            : '/images/background.jpg',
        author: typeof article.author === 'string' ? article.author : 'Ban biên tập',
        publishedAt: article.published_at,
        featured: Boolean(article.featured),
        content: typeof article.content === 'string' ? article.content : undefined,
    }
}

function getErrorMessage(error: unknown): string {
    if (axios.isAxiosError<{ message?: string }>(error)) {
        return error.response?.data?.message
            ?? 'Không thể kết nối API. Hãy kiểm tra backend và thử lại.'
    }
    return error instanceof Error ? error.message : 'Đã xảy ra lỗi khi tải dữ liệu.'
}

export async function getArticles(): Promise<Article[]> {
    try {
        const response = await articleClient.get<unknown>('/articles')
        if (!Array.isArray(response.data)) {
            throw new Error('API trả về danh sách bài viết không hợp lệ.')
        }
        return response.data.map(mapArticle)
    } catch (error) {
        throw new Error(getErrorMessage(error))
    }
}

export async function getArticleById(id: number): Promise<Article | undefined> {
    try {
        const response = await articleClient.get<unknown>(`/articles/${id}`)
        return mapArticle(response.data)
    } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
            return undefined
        }
        throw new Error(getErrorMessage(error))
    }
}

export async function getArticleBySlug(slug: string): Promise<Article | undefined> {
    const articles = await getArticles()
    return articles.find((article) => article.slug === slug)
}

export async function getCategories(): Promise<Category[]> {
    try {
        const response = await articleClient.get<unknown>('/categories')
        if (!Array.isArray(response.data)) {
            throw new Error('API trả về danh sách danh mục không hợp lệ.')
        }

        return response.data.map((value: unknown) => {
            if (typeof value !== 'object' || value === null) {
                throw new Error('API trả về danh mục không hợp lệ.')
            }
            const category = value as Record<string, unknown>
            if (!isCategorySlug(category.slug) || typeof category.name !== 'string') {
                throw new Error('API trả về danh mục không hợp lệ.')
            }
            return { slug: category.slug, name: category.name }
        })
    } catch (error) {
        throw new Error(getErrorMessage(error))
    }
}
