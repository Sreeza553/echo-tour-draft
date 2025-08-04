// === FILE: MusicRecommender.tsx ===
import React, { useState, useEffect } from 'react';
import { Music, Loader2, Play, Pause } from 'lucide-react';

const moods = ['Relaxed', 'Adventurous', 'Romantic', 'Energetic'];
const preferences = ['Bollywood', 'Hollywood', 'Fusion'];

interface Track {
  title: string;
  artist: string;
  url: string;
}

const MusicRecommender: React.FC = () => {
  const [destination, setDestination] = useState('');
  const [mood, setMood] = useState(moods[0]);
  const [preference, setPreference] = useState(preferences[0]);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(false);
  const [playingUrl, setPlayingUrl] = useState<string | null>(null);

  const fetchTracks = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/workflows/music-recommendation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ destination, mood, preference })
      });

      const data = await response.json();
      setTracks(data.tracks);
    } catch (err) {
      console.error('Failed to fetch music');
      setTracks([]);
    } finally {
      setLoading(false);
    }
  };

  const togglePlay = (url: string) => {
    const current = document.getElementById(`audio-${url}`) as HTMLAudioElement;
    if (!current) return;

    if (playingUrl === url) {
      current.pause();
      setPlayingUrl(null);
    } else {
      document.querySelectorAll('audio').forEach((audio) => audio !== current && audio.pause());
      current.play();
      setPlayingUrl(url);
    }
  };

  return (
    <div className="min-h-screen py-12 bg-gradient-to-br from-orange-50 via-yellow-50 to-pink-50">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-tr from-purple-500 to-pink-500 rounded-2xl mb-6 shadow-lg">
            <Music className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">AI Music Recommender</h1>
          <p className="text-lg text-gray-600">
            Get a playlist tailored to your trip, mood, and weather
          </p>
        </div>

        <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-xl p-8 mb-8 border border-purple-100 space-y-6">
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="Destination (e.g. Goa)"
            className="w-full px-4 py-3 border border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white/80"
          />
          <select
            value={mood}
            onChange={(e) => setMood(e.target.value)}
            className="w-full px-4 py-3 border border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white/80"
          >
            {moods.map((m) => <option key={m}>{m}</option>)}
          </select>
          <select
            value={preference}
            onChange={(e) => setPreference(e.target.value)}
            className="w-full px-4 py-3 border border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white/80"
          >
            {preferences.map((p) => <option key={p}>{p}</option>)}
          </select>

          <button
            onClick={fetchTracks}
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-semibold text-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
          >
            {loading ? 'Loading...' : 'Get My Playlist'}
          </button>
        </div>

        {tracks.length > 0 && (
          <div className="bg-white/90 p-6 rounded-3xl border border-purple-100 shadow-xl space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Playlist</h2>
            {tracks.map((track, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 border border-purple-100 rounded-xl bg-purple-50/40">
                <div>
                  <p className="font-semibold text-gray-800">{track.title}</p>
                  <p className="text-sm text-gray-600">{track.artist}</p>
                </div>
                <button
                  onClick={() => togglePlay(track.url)}
                  className="p-2 rounded-full hover:bg-purple-100"
                >
                  {playingUrl === track.url ? <Pause className="w-5 h-5 text-purple-600" /> : <Play className="w-5 h-5 text-purple-600" />}
                </button>
                <audio id={`audio-${track.url}`} src={track.url} preload="none" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MusicRecommender;
