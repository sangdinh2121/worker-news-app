import { Link } from 'react-router-dom'

export default function Footer() {
    return (
        <footer className="bg-dark text-light mt-5 py-4">
            <div className="container">
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <h5 className="text-danger fw-bold">BÁO ĐIỆN TỬ</h5>
                    </div>

                    <div className="col-md-3 mb-3">
                        <h6>Chuyên mục</h6>
                        <ul className="list-unstyled small mb-0">
                            <li><Link to="/category/thoi-su" className="text-light">Thời sự</Link></li>
                            <li><Link to="/category/cong-nghe" className="text-light">Công nghệ</Link></li>
                            <li><Link to="/category/the-thao" className="text-light">Thể thao</Link></li>
                        </ul>
                    </div>

                    <div className="col-md-3 mb-3">
                        <h6>Liên hệ</h6>
                        <p className="small mb-0">Email: contact@example.com</p>
                    </div>
                </div>

                <hr className="border-secondary" />
                <p className="text-center small mb-0">
                    © {new Date().getFullYear()} Báo Điện Tử.
                </p>
            </div>
        </footer>
    )
}