// === FILE: App.tsx ===
import React, { useState } from 'react';
import Hero from './Hero';
import ItineraryGenerator from './ItineraryGenerator';
import MusicRecommender from './MusicRecommender';
import VoiceMemoryTrack from './VoiceMemoryTrack';
import Navigation from './Navigation';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'hero' | 'itinerary' | 'stories' | 'music' | 'voice'>('hero');

  return (
    <div>
      <Navigation setActiveTab={setActiveTab} />
      {activeTab === 'hero' && <Hero setActiveTab={setActiveTab} />}
      {activeTab === 'itinerary' && <ItineraryGenerator />}
      {activeTab === 'music' && <MusicRecommender />}
      {activeTab === 'voice' && <VoiceMemoryTrack />}
    </div>
  );
};

export default App;


// === FILE: Navigation.tsx ===
import React from 'react';

interface Props {
  setActiveTab: (tab: 'hero' | 'itinerary' | 'stories' | 'music' | 'voice') => void;
}

const Navigation: React.FC<Props> = ({ setActiveTab }) => {
  return (
    <nav className="bg-white border-b shadow-md py-4 px-6 flex justify-between items-center sticky top-0 z-50">
      <h1 className="text-2xl font-bold text-orange-600">EchoTour</h1>
      <div className="flex gap-4 text-sm">
        <button onClick={() => setActiveTab('hero')} className="hover:text-orange-600">Home</button>
        <button onClick={() => setActiveTab('itinerary')} className="hover:text-orange-600">Planner</button>
        <button onClick={() => setActiveTab('music')} className="hover:text-orange-600">Music</button>
        <button onClick={() => setActiveTab('voice')} className="hover:text-orange-600">Voice Memories</button>
      </div>
    </nav>
  );
};

export default Navigation;
