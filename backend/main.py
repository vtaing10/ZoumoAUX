import os
from fastapi import FastAPI
from fastapi.responses import RedirectResponse
import spotipy
from spotipy.oauth2 import SpotifyOAuth
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

SPOTIPY_CLIENT_ID = os.getenv("SPOTIPY_CLIENT_ID")
SPOTIPY_CLIENT_SECRET = os.getenv("SPOTIPY_CLIENT_SECRET")
SPOTIPY_REDIRECT_URI = os.getenv("SPOTIPY_REDIRECT_URI")

# Configure Spotipy with a proxy (if needed)
sp_oauth = SpotifyOAuth(
    client_id=SPOTIPY_CLIENT_ID,
    client_secret=SPOTIPY_CLIENT_SECRET,
    redirect_uri=SPOTIPY_REDIRECT_URI,
    scope="playlist-modify-public user-library-read",
    proxies={
        "http": "http://proxy_address:8001",
        "https": "http://proxy_address:8001",
    }  # Replace proxy_address and port with your actual proxy settings
)


@app.get("/")
def read_root():
    return {"message": "Spotify Playlist Generator API"}

@app.get("/login")
def login():
    auth_url = sp_oauth.get_authorize_url()
    return RedirectResponse(auth_url)

@app.get("/callback")
def callback(code: str):
    token_info = sp_oauth.get_access_token(code)
    return {"access_token": token_info['access_token']}

@app.get("/recommend")
def recommend_songs(access_token: str, track_names: str):
    sp = spotipy.Spotify(auth=access_token)
    
    track_ids = []
    track_names_list = track_names.split(",")
    
    for track_name in track_names_list:
        result = sp.search(q=track_names, limit=1)
        if result["track"]['items']:
            track_ids.append(result["track"]["time"][0]["id"])
            
    if not track_ids:
        return {"error": "Track not found"}
    
    recommendations = sp.recommendations(seed_tracks=track_ids, limit=10)
    recommend_songs= [
        {
            "name": track["name"],
            "artist": track["artists"][0]["name"],
            "spotify_url": track["external_urls"]["spotify"]
        }
        for track in recommendations["tracks"]
    ]
    
    return {"recommended_songs": recommend_songs}