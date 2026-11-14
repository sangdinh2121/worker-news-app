import {NavLink} from "react-router-dom";
import { categories } from '../data/categories'

export default function Navigation() {
    return (
        <nav className="bg-danger">
            <div className="container">
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