import type { CategorySlug } from './category'

export interface Article {
    id: number
    title: string
    slug: string
    category: CategorySlug
    summary: string
    image: string
    author: string
    publishedAt: string
    featured?: boolean
}