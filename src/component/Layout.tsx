import Header from "./Header";
import {Outlet} from "react-router-dom";
import Footer from "./Footer.tsx";
import Navigation from "./Navigation.tsx";
import { useFavorites } from "../hooks/favoritesContext.ts";
import ScrollToTopButton from "./ScrollToTopButton.tsx";

export default function Layout() {
    const { error } = useFavorites()

    return (
        <>
            <Header />
            <Navigation />
            <main className="container py-4" style={{ minHeight: '100vh' }}>
                {error && <p className="alert alert-danger" role="alert">{error}</p>}
                <Outlet />
            </main>
            <Footer />
            <ScrollToTopButton />
        </>
    )
}