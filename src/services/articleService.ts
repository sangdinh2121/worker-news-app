import { articles as sampleArticles } from '../data/sampleArticles'
import type { Article } from '../types/article'

export async function getArticles(): Promise<Article[]> {
    return sampleArticles
}
