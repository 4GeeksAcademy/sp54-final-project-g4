import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import injectContext from "./store/appContext.js";
// Import custom component
import ScrollToTop from "./component/scrollToTop.js";
import { BackendURL } from "./component/BackendURL.jsx";
import { Navigation } from "./component/Navigation.jsx";
import { Footer } from "./component/Footer.jsx";
// Import custom pages
import { Home } from "./pages/Home.jsx";
import { Demo } from "./pages/Demo.jsx";
import { Single } from "./pages/Single.jsx";
import { Carroussel } from "./component/Carroussel.jsx";
import { Buscador } from "./pages/Buscador.jsx";
import { Profile } from "./pages/Profile.jsx";
import { MovieDetails } from "./pages/MovieInfo.jsx";

// Create your first component
const Layout = () => {
    // The basename is used when your project is published in a subdirectory and not in the root of the domain
    // you can set the basename on the .env file located at the root of this project, E.g: BASENAME=/react-hello-webapp/
    const basename = process.env.BASENAME || "";
    if (!process.env.BACKEND_URL || process.env.BACKEND_URL == "") return <BackendURL />;

    return (
        <div>
            <BrowserRouter basename={basename}>
                <ScrollToTop>
                    <Navigation />
                    <Routes>
                        <Route element={<Home />} path="/" />
                        <Route element={<Demo />} path="/demo" />
                        <Route element={<Single />} path="/single/:theid" />
                        <Route element={<h1>Not found!</h1>} />
                        <Route element={<Carroussel />} path="/carrussel" />
                        <Route element={<Buscador />} path="/buscador" />
                        <Route element={<MovieDetails />} path="/movie/:movieid" />
                        <Route element={<Profile />} path="/profile/:username" />
                    </Routes>
                    <Footer />
                </ScrollToTop>
            </BrowserRouter>
        </div>
    );
};

export default injectContext(Layout);
