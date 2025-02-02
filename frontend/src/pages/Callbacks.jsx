import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

function Callback() {
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const code = params.get("code");

        if (code) {
            // Send authorization code to the backend for token exchange
            fetch(`http://127.0.0.1:8000/callback?code=${code}`)
                .then((response) => response.json())
                .then((data) => {
                    console.log("Access Token:", data.access_token);
                    localStorage.setItem("spotify_access_token", data.access_token);
                    window.location.href = "/"; // Redirect back to homepage
                })
                .catch((error) => console.error("Error fetching access token:", error));
        }
    }, [location]);

    return <div>Redirecting...</div>;
}

export default Callback;
