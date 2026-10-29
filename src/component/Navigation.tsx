import {NavLink} from "react-router-dom";

const categories = [
    { name: 'Trang chủ', path: '/' },
    { name: 'Thời sự', path: '/category/thoi-su' },
    { name: 'Thế giới', path: '/category/the-gioi' },
    { name: 'Kinh doanh', path: '/category/kinh-doanh' },
    { name: 'Công nghệ', path: '/category/cong-nghe' },
    { name: 'Thể thao', path: '/category/the-thao' },
    { name: 'Giải trí', path: '/category/giai-tri' },
]

export default function Navigation() {
    return (
        <nav className="bg-danger">
            <div className="container">
                <ul className="nav">
                    {categories.map((item) => (
                        <li className="nav-item" key={item.path}>
                            <NavLink
                                to={item.path}
                                end={item.path === '/'}
                                className={({ isActive }) =>
                                    'nav-link text-white' + (isActive ? ' fw-bold bg-dark bg-opacity-25' : '')
                                }
                            >
                                {item.name}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </div>
        </nav>
    )
}