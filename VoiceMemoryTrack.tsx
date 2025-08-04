// === FILE: VoiceMemoryTrack.tsx ===
import React, { useState, useRef } from 'react';
import { Mic, Loader2, Download } from 'lucide-react';

const VoiceMemoryTrack = () => {
  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunks.current = [];

      mediaRecorder.ondataavailable = event => {
        if (event.data.size > 0) {
          audioChunks.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunks.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setAudioURL(url);
      };

      mediaRecorder.start();
      setRecording(true);
    } catch (err) {
      console.error('Error accessing microphone:', err);
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

  const handleGenerateTrack = async () => {
    if (!audioURL) return;
    setLoading(true);

    try {
      const response = await fetch('/api/workflows/voice-memory', {
        method: 'POST',
        body: JSON.stringify({ audioURL }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (data?.soundtrack_url) {
        setAudioURL(data.soundtrack_url);
      }
    } catch (err) {
      console.error('Error generating soundtrack:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-pink-50 py-12 px-6">
      <div className="max-w-xl mx-auto bg-white/90 rounded-3xl p-8 shadow-xl border border-orange-100 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-tr from-orange-500 to-pink-500 rounded-2xl mb-6 shadow-lg">
          <Mic className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-3">Voice Memory Track</h2>
        <p className="text-gray-600 mb-6">Capture your real travel moments as ambient soundtracks</p>

        <div className="space-y-4">
          {!recording && (
            <button
              onClick={startRecording}
              className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white py-3 rounded-xl font-semibold text-lg hover:shadow-lg transition-all duration-300"
            >
              Start Recording
            </button>
          )}

          {recording && (
            <button
              onClick={stopRecording}
              className="w-full bg-yellow-500 text-white py-3 rounded-xl font-semibold text-lg hover:shadow-lg transition-all duration-300"
            >
              Stop Recording
            </button>
          )}

          {audioURL && !recording && (
            <>
              <audio controls className="w-full">
                <source src={audioURL} type="audio/webm" />
                Your browser does not support the audio element.
              </audio>
              <button
                onClick={handleGenerateTrack}
                disabled={loading}
                className="w-full bg-gradient-to-r from-orange-600 to-pink-600 text-white py-3 rounded-xl font-semibold text-lg hover:shadow-lg transition-all duration-300 flex justify-center items-center"
              >
                {loading ? <><Loader2 className="w-5 h-5 animate-spin mr-2" />Generating Track...</> : 'Weave Memory into Music'}
              </button>
            </>
          )}

          {audioURL && (
            <a
              href={audioURL}
              download="memory-track.webm"
              className="inline-flex items-center mt-4 text-orange-600 hover:underline"
            >
              <Download className="w-4 h-4 mr-1" /> Download Your Memory Track
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default VoiceMemoryTrack;
