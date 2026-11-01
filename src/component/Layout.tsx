import Header from "./Header";
import {Outlet} from "react-router-dom";
import Footer from "./Footer.tsx";
import Navigation from "./Navigation.tsx";

export default function Layout() {
    return (
        <>
            <Header />
            <Navigation />
            <main className="container py-4" style={{ minHeight: '100vh' }}>
                <Outlet />
            </main>
            <Footer />
        </>
    )
}