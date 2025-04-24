
import React from 'react';
import Sidebar from '@/components/sidebar/Sidebar';
import TopBar from '@/components/TopBar';
import HomeContent from '@/components/content/HomeContent';
import MusicPlayer from '@/components/player/MusicPlayer';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Music, PlayCircle } from 'lucide-react';

const PreLoginBanner = () => (
  <div className="bg-gradient-to-br from-indigo-800 to-pink-700 p-8 rounded-lg mb-6">
    <h2 className="text-3xl font-bold mb-3">Welcome to Spotify</h2>
    <p className="text-lg mb-4">Millions of songs and podcasts. No credit card needed.</p>
    <div className="flex gap-4">
      <Link to="/register">
        <Button className="bg-green-500 hover:bg-green-400 text-black font-bold py-3 px-8">
          cd Sign up for free
        </Button>
      </Link>
      <Link to="/login">
        <Button variant="outline" className="text-white border-white hover:bg-white/10">
          Log in
        </Button>
      </Link>
    </div>
  </div>
);

const PreviewFeatures = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
    <div className="bg-zinc-800 p-6 rounded-lg">
      <PlayCircle size={48} className="mb-3 text-green-500" />
      <h3 className="text-xl font-bold mb-2">Millions of songs</h3>
      <p className="text-gray-400">Access to over 70 million songs, from new releases to all-time classics.</p>
    </div>
    <div className="bg-zinc-800 p-6 rounded-lg">
      <Music size={48} className="mb-3 text-green-500" />
      <h3 className="text-xl font-bold mb-2">Discover new music</h3>
      <p className="text-gray-400">Personalized playlists and recommendations based on your taste.</p>
    </div>
    <div className="bg-zinc-800 p-6 rounded-lg">
      <PlayCircle size={48} className="mb-3 text-green-500" />
      <h3 className="text-xl font-bold mb-2">Ad-free music</h3>
      <p className="text-gray-400">Enjoy uninterrupted listening with Premium. No ads, just music.</p>
    </div>
  </div>
);

const Index = () => {
  const { isAuthenticated, isLoading } = useAuth();
  
  return (
    <div className="h-screen flex flex-col bg-spotify-base">
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 flex flex-col overflow-hidden">
          <TopBar />
          {isAuthenticated ? (
            <HomeContent />
          ) : (
            <div className="flex-1 overflow-auto p-6 pb-28">
              <PreLoginBanner />
              <PreviewFeatures />
              <HomeContent />
            </div>
          )}
        </main>
      </div>
      <MusicPlayer />
    </div>
  );
};

export default Index;
