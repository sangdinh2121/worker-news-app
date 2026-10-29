import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './component/Header'
import Footer from './component/Footer'
import Navigation from './component/Navigation'

function App() {
    return (
        <BrowserRouter>
            <Header />
            <Navigation />
            <main className="container py-4" style={{ minHeight: '100vh' }}>
                <Routes>
                    <Route path="/" element={<h2>Trang chủ</h2>} />
                </Routes>
            </main>
            <Footer />
        </BrowserRouter>
    )
}

export default App
