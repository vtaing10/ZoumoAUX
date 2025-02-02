import React from "react";
import { Route, Routes } from "react-router-dom";
import Callback from "./pages/Callback";
import Home from "./pages/Home";

function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/callback" element={<Callback />} />
        </Routes>
    );
}

export default App;
