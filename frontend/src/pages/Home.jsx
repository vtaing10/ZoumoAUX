import React, { useState } from "react";
import { createPlaylist, fetchRecommendations } from "../api/spotify";

function Home() {
    const [songs, setSongs] = useState(""); // For user-input songs
    const [recommendations, setRecommendations] = useState([]); // For recommended songs
    const [playlistName, setPlaylistName] = useState(""); // For the playlist name
    const [playlistURL, setPlaylistURL] = useState(""); // URL of the created playlist

    const handleLogin = () => {
        // Redirect to backend's Spotify login
        window.location.href = "http://127.0.0.1:8001/login";
    };

    const handleGenerate = async () => {
        const accessToken = localStorage.getItem("spotify_access_token");
        if (!accessToken) {
            alert("Please log in first.");
            return;
        }

        try {
            // Fetch recommendations from backend
            const data = await fetchRecommendations(accessToken, songs);
            setRecommendations(data.recommended_songs);
        } catch (error) {
            console.error("Error fetching recommendations:", error);
        }
    };

    const handleCreatePlaylist = async () => {
        const accessToken = localStorage.getItem("spotify_access_token");
        if (!accessToken) {
            alert("Please log in first.");
            return;
        }

        try {
            const trackURIs = recommendations.map((song) =>
                song.spotify_url.replace("https://open.spotify.com/track/", "spotify:track:")
            ).join(",");

            // Create a playlist via backend
            const data = await createPlaylist(accessToken, playlistName, trackURIs);
            setPlaylistURL(data.playlist_url);
        } catch (error) {
            console.error("Error creating playlist:", error);
        }
    };

    return (
        <div>
            <h1>Spotify Playlist Generator</h1>
            <button onClick={handleLogin}>Login with Spotify</button>

            <div>
                <h2>Enter Songs</h2>
                <input
                    type="text"
                    placeholder="Enter song names, comma-separated"
                    value={songs}
                    onChange={(e) => setSongs(e.target.value)}
                />
                <button onClick={handleGenerate}>Get Recommendations</button>
            </div>

            {recommendations.length > 0 && (
                <div>
                    <h2>Recommended Songs</h2>
                    <ul>
                        {recommendations.map((song, index) => (
                            <li key={index}>
                                {song.name} by {song.artist} - <a href={song.spotify_url}>Listen</a>
                            </li>
                        ))}
                    </ul>

                    <div>
                        <h2>Create Playlist</h2>
                        <input
                            type="text"
                            placeholder="Playlist Name"
                            value={playlistName}
                            onChange={(e) => setPlaylistName(e.target.value)}
                        />
                        <button onClick={handleCreatePlaylist}>Create Playlist</button>
                    </div>
                </div>
            )}

            {playlistURL && (
                <div>
                    <h2>Playlist Created</h2>
                    <p>
                        <a href={playlistURL} target="_blank" rel="noopener noreferrer">
                            View Playlist on Spotify
                        </a>
                    </p>
                </div>
            )}
        </div>
    );
}

export default Home;
