import {Link, useNavigate} from "react-router-dom";
import {useState} from "react";

export default function header() {
    const [keyword, setKeyword] = useState('')
    const navigate = useNavigate()

    const today = new Date().toLocaleDateString('vi-VN', {
        weekday: 'long',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    })

    return (
        <header className="border-bottom bg-white">
            <div className="container py-3 d-flex flex-wrap align-items-center justify-content-between gap-2">
                <div>
                    <Link to="/" className="text-decoration-none">
                        <h1 className="h2 fw-bold text-danger mb-0">BÁO ĐIỆN TỬ</h1>
                    </Link>
                    <small className="text-muted">{today}</small>
                </div>

                <form
                    className="d-flex"
                    onSubmit={(e) => {
                        e.preventDefault()
                        if (keyword.trim()) {
                            navigate(`/search?q=${encodeURIComponent(keyword.trim())}`)
                        }
                    }}
                >
                    <input
                        type="search"
                        className="form-control me-2"
                        placeholder="Tìm kiếm tin tức..."
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                    />
                    <button className="btn btn-danger text-nowrap" type="submit">
                        Tìm
                    </button>
                </form>
            </div>
        </header>
    )
}