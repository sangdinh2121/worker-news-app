
import { categories as sampleCategories } from '../data/categories'
import type { Article } from '../types/article'
import type { Category } from '../types/category'
import * as axios from "axios";

const articleClient = axios.create({
    baseURL: import.meta.env.BASE_URL,
})

export async function getArticles(): Promise<Article[]> {
    const response = await articleClient.get<Article[]>('data/article.json')
    return response.data
}

export async function getArticleById(id: number): Promise<Article | undefined> {
    const articles = await getArticles()
    return articles.find((article) => article.id === id)
}

export async function getArticleBySlug(slug: string): Promise<Article | undefined> {
    const articles = await getArticles()
    return articles.find((article) => article.slug === slug)
}

export async function getCategories(): Promise<Category[]> {
    return sampleCategories
}
