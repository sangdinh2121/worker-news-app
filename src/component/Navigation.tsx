import { NavLink } from 'react-router-dom'
import { useCategories } from '../hooks/useCategories'

export default function Navigation() {
    const { categories, error } = useCategories()

    return (
        <nav className="bg-danger">
            <div className="container">
                {error && <p className="text-white small mb-0 py-1" role="alert">{error}</p>}
                <ul className="nav">
                    <li className="nav-item">
                        <NavLink
                            to="/"
                            end
                            className={({ isActive }) =>
                                'nav-link text-white' + (isActive ? ' fw-bold bg-dark bg-opacity-25' : '')
                            }
                        >
                            Trang chủ
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink
                            to="/favorites"
                            className={({ isActive }) =>
                                'nav-link text-white' + (isActive ? ' fw-bold bg-dark bg-opacity-25' : '')
                            }
                        >
                            Tin đã lưu
                        </NavLink>
                    </li>
                    {categories.map((item) => (
                        <li className="nav-item" key={item.slug}>
                            <NavLink
                                to={`/category/${item.slug}`}
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