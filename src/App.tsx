import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'

function Home() {
    return <h1>Trang chủ</h1>
}

function About() {
    return <h1>Giới thiệu</h1>
}

function App() {
    return (
        <BrowserRouter>
            <nav>
                <Link to="/">Trang chủ</Link> | <Link to="/about">Giới thiệu</Link>
            </nav>

            <Routes>
                <Route path="/" element={<Home/>} />
                <Route path="/about" element={<About/>}/>
            </Routes>
        </BrowserRouter>
    )
}

export default App
