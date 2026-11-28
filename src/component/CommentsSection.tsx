import {useEffect, useState} from 'react'
import {
    createArticleComment,
    getArticleComments,
    login,
    register,
} from '../services/commentsService'
import type {ArticleComment, AuthUser} from '../services/commentsService'

interface Props {
    articleId: number
}

type AuthMode = 'login' | 'register'
const AUTH_SESSION_KEY = 'worker-news-comment-session'

function isAuthUser(value: unknown): value is AuthUser {
    return typeof value === 'object' && value !== null &&
        'id' in value && typeof value.id === 'number' &&
        'username' in value && typeof value.username === 'string' &&
        'fullName' in value && typeof value.fullName === 'string'
}

function readAuthSession(): {
    session: { token: string; user: AuthUser } | null
    error: string | null
} {
    try {
        const storedSession = sessionStorage.getItem(AUTH_SESSION_KEY)
        if (!storedSession) return {session: null, error: null}

        const value: unknown = JSON.parse(storedSession)
        if (
            typeof value === 'object' && value !== null &&
            'token' in value && typeof value.token === 'string' &&
            'user' in value && isAuthUser(value.user)
        ) {
            return {
                session: {token: value.token, user: value.user},
                error: null,
            }
        }

        sessionStorage.removeItem(AUTH_SESSION_KEY)
        return {session: null, error: 'Phiên đăng nhập đã lưu không hợp lệ. Vui lòng đăng nhập lại.'}
    } catch {
        return {session: null, error: 'Không thể khôi phục phiên đăng nhập trong trình duyệt.'}
    }
}

export default function CommentsSection({articleId}: Props) {
    const [initialSession] = useState(readAuthSession)
    const [comments, setComments] = useState<ArticleComment[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [loadError, setLoadError] = useState<string | null>(null)
    const [authError, setAuthError] = useState<string | null>(initialSession.error)
    const [commentError, setCommentError] = useState<string | null>(null)
    const [authMode, setAuthMode] = useState<AuthMode>('login')
    const [user, setUser] = useState<AuthUser | null>(initialSession.session?.user ?? null)
    const [token, setToken] = useState<string | null>(initialSession.session?.token ?? null)
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [fullName, setFullName] = useState('')
    const [content, setContent] = useState('')
    const [isAuthenticating, setIsAuthenticating] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const commentCount = comments.length

    useEffect(() => {
        let isActive = true

        getArticleComments(articleId)
            .then((loadedComments) => {
                if (isActive) setComments(loadedComments)
            })
            .catch((error: unknown) => {
                if (isActive) {
                    setLoadError(error instanceof Error ? error.message : 'Không thể tải bình luận.')
                }
            })
            .finally(() => {
                if (isActive) setIsLoading(false)
            })

        return () => {
            isActive = false
        }
    }, [articleId])

    async function handleAuthSubmit(event: { preventDefault: () => void }) {
        event.preventDefault()
        setAuthError(null)
        setIsAuthenticating(true)

        try {
            const result = authMode === 'login'
                ? await login(username, password)
                : await register(username, password, fullName)
            setToken(result.token)
            setUser(result.user)
            setPassword('')
            try {
                sessionStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(result))
                setAuthError(null)
            } catch {
                setAuthError('Đăng nhập thành công nhưng không thể lưu phiên trong trình duyệt.')
            }
        } catch (error) {
            setAuthError(error instanceof Error ? error.message : 'Không thể xác thực tài khoản.')
        } finally {
            setIsAuthenticating(false)
        }
    }

    async function handleCommentSubmit(event: { preventDefault: () => void }) {
        event.preventDefault()
        if (!token) return

        setCommentError(null)
        setIsSubmitting(true)
        try {
            const comment = await createArticleComment(articleId, content, token)
            setComments((current) => [...current, comment])
            setContent('')
        } catch (error) {
            setCommentError(error instanceof Error ? error.message : 'Không thể gửi bình luận.')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <section className="comments-section mx-auto mt-5" aria-labelledby="comments-heading">
            <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-4">
                <h2 id="comments-heading" className="h4 fw-bold mb-0">Bình luận</h2>
                <span className="badge rounded-pill text-bg-light border">{commentCount}</span>
            </div>

            {isLoading && (
                <p className="text-muted py-3" role="status">
                    <span className="spinner-border spinner-border-sm text-danger me-2" aria-hidden="true"/>
                    Đang tải bình luận...
                </p>
            )}
            {loadError && <p className="alert alert-danger" role="alert">{loadError}</p>}
            {!isLoading && !loadError && comments.length === 0 && (
                <div className="comments-section__empty rounded-3 bg-light text-center p-4 mb-4">
                    <p className="fw-semibold mb-1">Chưa có bình luận nào</p>
                    <p className="text-muted small mb-0">Hãy là người đầu tiên chia sẻ ý kiến về bài viết này.</p>
                </div>
            )}
            {comments.length > 0 && (
                <ul className="list-unstyled d-flex flex-column gap-3 mb-4">
                    {comments.map((comment) => (
                        <li key={comment.id} className="comments-section__item rounded-3 border bg-white p-3 p-md-4">
                            <div className="d-flex flex-wrap justify-content-between gap-2 mb-2">
                                <div className="d-flex align-items-center gap-2">
                                    <span
                                        className="comments-section__avatar rounded-circle bg-danger-subtle text-danger fw-bold d-inline-flex align-items-center justify-content-center"
                                        aria-hidden="true">
                                        {comment.author.trim().charAt(0).toUpperCase()}
                                    </span>
                                    <strong>{comment.author}</strong>
                                </div>
                                <time className="text-muted small" dateTime={comment.createdAt}>
                                    {new Date(comment.createdAt).toLocaleString('vi-VN')}
                                </time>
                            </div>
                            <p className="mb-0" style={{whiteSpace: 'pre-line'}}>{comment.content}</p>
                        </li>
                    ))}
                </ul>
            )}

            {user && token ? (
                <div className="comments-section__form card border-0 bg-light">
                    <div className="card-body p-3 p-md-4">
                        <p className="text-muted small mb-3">Đang đăng nhập với tên <strong
                            className="text-dark">{user.fullName}</strong>.</p>
                        <form onSubmit={handleCommentSubmit}>
                            <label htmlFor="article-comment" className="form-label">Viết bình luận</label>
                            <textarea
                                id="article-comment"
                                className="form-control mb-2"
                                rows={4}
                                maxLength={1000}
                                value={content}
                                onChange={(event) => setContent(event.target.value)}
                                required
                                aria-describedby="comment-length"
                            />
                            <div className="d-flex justify-content-between align-items-center gap-3">
                                <small id="comment-length" className="text-muted">{content.length}/1000</small>
                                <button className="btn btn-danger" type="submit"
                                        disabled={isSubmitting || !content.trim()}>
                                    {isSubmitting ? 'Đang gửi...' : 'Gửi bình luận'}
                                </button>
                            </div>
                        </form>
                        {commentError && <p className="alert alert-danger mt-3" role="alert">{commentError}</p>}
                        <button
                            className="btn btn-link px-0"
                            type="button"
                            onClick={() => {
                                try {
                                    sessionStorage.removeItem(AUTH_SESSION_KEY)
                                    setAuthError(null)
                                } catch {
                                    setAuthError('Không thể xóa phiên đăng nhập khỏi trình duyệt.')
                                }
                                setToken(null)
                                setUser(null)
                            }}
                        >
                            Đăng xuất
                        </button>
                    </div>
                </div>
            ) : (
                <div className="comments-section__form card border-0 bg-light">
                    <div className="card-body p-3 p-md-4">
                        <h3 className="h5 fw-bold">{authMode === 'login' ? 'Đăng nhập để bình luận' : 'Tạo tài khoản để bình luận'}</h3>
                        <div className="btn-group mb-3" role="group" aria-label="Chọn đăng nhập hoặc đăng ký">
                            <button
                                type="button"
                                className={`btn ${authMode === 'login' ? 'btn-danger' : 'btn-outline-danger'}`}
                                onClick={() => {
                                    setAuthMode('login')
                                    setAuthError(null)
                                }}
                            >
                                Đăng nhập
                            </button>
                            <button
                                type="button"
                                className={`btn ${authMode === 'register' ? 'btn-danger' : 'btn-outline-danger'}`}
                                onClick={() => {
                                    setAuthMode('register')
                                    setAuthError(null)
                                }}
                            >
                                Đăng ký
                            </button>
                        </div>
                        <form onSubmit={handleAuthSubmit}>
                            {authMode === 'register' && (
                                <div className="mb-3">
                                    <label htmlFor="comment-full-name" className="form-label">Họ tên</label>
                                    <input
                                        id="comment-full-name"
                                        className="form-control"
                                        autoComplete="name"
                                        maxLength={100}
                                        value={fullName}
                                        onChange={(event) => setFullName(event.target.value)}
                                        required
                                    />
                                </div>
                            )}
                            <div className="mb-3">
                                <label htmlFor="comment-username" className="form-label">Tên đăng nhập</label>
                                <input
                                    id="comment-username"
                                    className="form-control"
                                    autoComplete="username"
                                    minLength={3}
                                    maxLength={30}
                                    value={username}
                                    onChange={(event) => setUsername(event.target.value)}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="comment-password" className="form-label">Mật khẩu</label>
                                <input
                                    id="comment-password"
                                    className="form-control"
                                    type="password"
                                    autoComplete={authMode === 'login' ? 'current-password' : 'new-password'}
                                    minLength={6}
                                    value={password}
                                    onChange={(event) => setPassword(event.target.value)}
                                    required
                                />
                            </div>
                            <button className="btn btn-danger" type="submit" disabled={isAuthenticating}>
                                {isAuthenticating ? 'Đang xử lý...' : authMode === 'login' ? 'Đăng nhập' : 'Tạo tài khoản'}
                            </button>
                        </form>
                        {authError && <p className="alert alert-danger mt-3 mb-0" role="alert">{authError}</p>}
                    </div>
                </div>
            )}
        </section>
    )
}
