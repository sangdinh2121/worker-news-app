import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from "./component/Layout.tsx";
import HomePage from "./pages/HomePage.tsx";
import CategoryPage from "./pages/CategoryPage.tsx";
import ArticleDetailPage from "./pages/ArticleDetailPage.tsx";
import SearchPage from "./pages/SearchPage.tsx";
import FavoritesPage from "./pages/FavoritesPage.tsx";
import { FavoritesProvider } from "./hooks/FavoritesProvider.tsx";


function App() {
    return (
        <BrowserRouter>
            <FavoritesProvider>
                <Routes>
                    <Route element={<Layout />}>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/category/:slug" element={<CategoryPage />} />
                        <Route path="/article/:id" element={<ArticleDetailPage />} />
                        <Route path="/search" element={<SearchPage />} />
                        <Route path="/favorites" element={<FavoritesPage />} />
                    </Route>
                </Routes>
            </FavoritesProvider>
        </BrowserRouter>
    )
}

export default App
