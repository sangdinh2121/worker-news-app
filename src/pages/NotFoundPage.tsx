import {Link} from "react-router-dom";

export default function NotFoundPage() {
    return (
        <>
            <div className="text-center py-5">
                <h1 className="display-1 fw-bold text-danger">404</h1>
                <h3 className="mb-3">Không tìm thấy trang</h3>
                <p className="text-muted mb-4">
                    Đường dẫn bạn truy cập không tồn tại.
                </p>
                <Link to="/" className="btn btn-danger">
                    Về trang chủ
                </Link>
            </div>
        </>
    )
}