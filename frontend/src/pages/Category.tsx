
import React from 'react';
import Sidebar from '@/components/sidebar/Sidebar';
import TopBar from '@/components/TopBar';
import MusicPlayer from '@/components/player/MusicPlayer';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useParams } from 'react-router-dom';
import PlaylistGrid from '@/components/content/PlaylistGrid';

const CategoryPage = () => {
  const { id } = useParams<{ id: string }>();
  const categoryId = parseInt(id || '0');
  
  // Mock data - In a real app, this would come from an API based on the category ID
  const categories = [
    { id: 1, name: 'Pop', color: 'bg-pink-600', description: 'Trending pop music' },
    { id: 2, name: 'Hip-Hop', color: 'bg-orange-600', description: 'Urban beats and rhymes' },
    { id: 3, name: 'Rock', color: 'bg-red-600', description: 'Classic and modern rock' },
    { id: 4, name: 'Electronic', color: 'bg-blue-600', description: 'Electronic dance music' },
    { id: 5, name: 'R&B', color: 'bg-purple-600', description: 'Rhythm and blues' },
    { id: 6, name: 'Indie', color: 'bg-green-600', description: 'Independent artists' },
    { id: 7, name: 'Jazz', color: 'bg-yellow-600', description: 'Smooth jazz classics' },
    { id: 8, name: 'Classical', color: 'bg-teal-600', description: 'Classical masterpieces' },
  ];

  const category = categories.find(cat => cat.id === categoryId) || categories[0];
  
  const featuredPlaylists = [
    { id: 1, title: "Today's Top Hits", description: "The biggest hits right now", image: "https://placehold.co/300x300?text=Top+Hits" },
    { id: 2, title: "RapCaviar", description: "Hip-hop hits from the hottest artists", image: "https://placehold.co/300x300?text=RapCaviar" },
    { id: 3, title: "All Out 2010s", description: "The biggest songs of the 2010s", image: "https://placehold.co/300x300?text=2010s" },
    { id: 4, title: "Rock Classics", description: "Rock legends & epic songs", image: "https://placehold.co/300x300?text=Rock+Classics" },
    { id: 5, title: "Chill Hits", description: "Kick back to the best new and recent chill hits", image: "https://placehold.co/300x300?text=Chill+Hits" },
    { id: 6, title: "Mood Booster", description: "Get happy with today's dose of feel-good songs!", image: "https://placehold.co/300x300?text=Mood+Booster" },
  ];
  
  const popularPlaylists = [
    { id: 7, title: "This Is Taylor Swift", description: "The essential Taylor Swift tracks", image: "https://placehold.co/300x300?text=Taylor+Swift" },
    { id: 8, title: "Acoustic Hits", description: "Mellow acoustic tracks", image: "https://placehold.co/300x300?text=Acoustic+Hits" },
    { id: 9, title: "Viral Hits", description: "Tracks from viral internet moments", image: "https://placehold.co/300x300?text=Viral+Hits" },
    { id: 10, title: "Peaceful Piano", description: "Relax with ambient piano pieces", image: "https://placehold.co/300x300?text=Piano" },
    { id: 11, title: "Deep Focus", description: "Keep calm and focus", image: "https://placehold.co/300x300?text=Focus" },
    { id: 12, title: "Sleep", description: "Gentle lullabies to help you fall asleep", image: "https://placehold.co/300x300?text=Sleep" },
  ];

  return (
    <div className="h-screen flex flex-col bg-spotify-base">
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 flex flex-col overflow-hidden">
          <TopBar />
          <ScrollArea className="flex-1 pb-28">
            {/* Hero section */}
            <div className={`h-80 ${category.color} flex items-end p-8`}>
              <div>
                <p className="text-sm text-white opacity-80">CATEGORY</p>
                <h1 className="text-8xl font-bold text-white mt-2 mb-6">{category.name}</h1>
                <p className="text-white opacity-80">{category.description}</p>
              </div>
            </div>
            
            <div className="p-6">
              <PlaylistGrid 
                title="Featured Playlists" 
                playlists={featuredPlaylists} 
                seeAllLink="/featured"
              />
              
              <PlaylistGrid 
                title="Popular Playlists" 
                playlists={popularPlaylists} 
                seeAllLink="/popular"
              />
            </div>
          </ScrollArea>
        </main>
      </div>
      <MusicPlayer />
    </div>
  );
};

export default CategoryPage;
