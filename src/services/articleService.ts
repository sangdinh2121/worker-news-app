import { articles as sampleArticles } from '../data/sampleArticles'
import { categories as sampleCategories } from '../data/categories'
import type { Article } from '../types/article'
import type { Category } from '../types/category'

export async function getArticles(): Promise<Article[]> {
    return sampleArticles
}

export async function getArticleById(id: number): Promise<Article | undefined> {
    return sampleArticles.find((article) => article.id === id)
}

export async function getArticleBySlug(slug: string): Promise<Article | undefined> {
    return sampleArticles.find((article) => article.slug === slug)
}

export async function getCategories(): Promise<Category[]> {
    return sampleCategories
}
