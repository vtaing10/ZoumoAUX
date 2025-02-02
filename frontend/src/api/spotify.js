export async function fetchRecommendations(accessToken, trackNames) {
    const response = await fetch(`http://127.0.0.1:8000/recommend?access_token=${accessToken}&track_names=${trackNames}`);
    if (!response.ok) {
        throw new Error("Failed to fetch recommendations");
    }
    return response.json();
}

export async function createPlaylist(accessToken, playlistName, trackURIs) {
    const response = await fetch(
        `http://127.0.0.1:8000/create_playlist?access_token=${accessToken}&playlist_name=${playlistName}&track_uris=${trackURIs}`,
        {
            method: "POST",
        }
    );
    if (!response.ok) {
        throw new Error("Failed to create playlist");
    }
    return response.json();
}
