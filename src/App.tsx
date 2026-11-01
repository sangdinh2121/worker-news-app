import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from "./component/Layout.tsx";
import HomePage from "./pages/HomePage.tsx";
import CategoryPage from "./pages/CategoryPage.tsx";
import ArticleDetailPage from "./pages/ArticleDetailPage.tsx";


function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<Layout />}>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/category/:slug" element={<CategoryPage />} />
                    <Route path="/article/:id" element={<ArticleDetailPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default App
