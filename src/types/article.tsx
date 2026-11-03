export interface Article {
    id: number
    title: string
    slug: string
    category: string
    summary: string
    image: string
    author: string
    publishedAt: string
    featured?: boolean
}