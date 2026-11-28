import axios from 'axios'

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
})

export interface ArticleComment {
    id: number
    articleId: number
    content: string
    createdAt: string
    author: string
}

export interface AuthUser {
    id: number
    username: string
    fullName: string
}

interface AuthResponse {
    token: string
    user: AuthUser
}

function getErrorMessage(error: unknown): string {
    if (axios.isAxiosError<{ message?: string }>(error)) {
        return error.response?.data?.message
            ?? 'Không thể kết nối API. Hãy kiểm tra backend và thử lại.'
    }
    return error instanceof Error ? error.message : 'Đã xảy ra lỗi.'
}

export async function getArticleComments(articleId: number): Promise<ArticleComment[]> {
    try {
        const response = await apiClient.get<ArticleComment[]>(`/articles/${articleId}/comments`)
        return response.data
    } catch (error) {
        throw new Error(getErrorMessage(error))
    }
}

export async function createArticleComment(
    articleId: number,
    content: string,
    token: string,
): Promise<ArticleComment> {
    try {
        const response = await apiClient.post<ArticleComment>(
            `/articles/${articleId}/comments`,
            { content },
            { headers: { Authorization: `Bearer ${token}` } },
        )
        return response.data
    } catch (error) {
        throw new Error(getErrorMessage(error))
    }
}

export async function login(
    username: string,
    password: string,
): Promise<AuthResponse> {
    try {
        const response = await apiClient.post<AuthResponse>('/auth/login', {
            username,
            password,
        })
        return response.data
    } catch (error) {
        throw new Error(getErrorMessage(error))
    }
}

export async function register(
    username: string,
    password: string,
    fullName: string,
): Promise<AuthResponse> {
    try {
        const response = await apiClient.post<AuthResponse>('/auth/register', {
            username,
            password,
            fullName,
        })
        return response.data
    } catch (error) {
        throw new Error(getErrorMessage(error))
    }
}
