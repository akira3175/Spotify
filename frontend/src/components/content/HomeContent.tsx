
import React from 'react';
import PlaylistGrid from './PlaylistGrid';
import { ScrollArea } from '@/components/ui/scroll-area';

// Sample data for playlists
const recentlyPlayed = [
  { id: 1, title: 'Daily Mix 1', description: 'Kendrick Lamar, J. Cole and more', image: '/placeholder.svg' },
  { id: 2, title: 'Chill Vibes', description: 'Relaxing beats to study and focus', image: '/placeholder.svg' },
  { id: 3, title: 'Rock Classics', description: 'The greatest rock songs of all time', image: '/placeholder.svg' },
  { id: 4, title: 'Running Mix', description: 'High energy music for your workout', image: '/placeholder.svg' },
  { id: 5, title: 'Acoustic Favorites', description: 'Mellow acoustic tracks', image: '/placeholder.svg' },
  { id: 6, title: '2010s Mix', description: 'Throwback to the hits from last decade', image: '/placeholder.svg' },
];

const madeForYou = [
  { id: 1, title: 'Discover Weekly', description: 'Your weekly mixtape of fresh music', image: '/placeholder.svg' },
  { id: 2, title: 'Release Radar', description: 'Catch all the latest music from artists you follow', image: '/placeholder.svg' },
  { id: 3, title: 'Your Time Capsule', description: 'Songs from your past we think you\'ll love', image: '/placeholder.svg' },
  { id: 4, title: 'Daily Mix 2', description: 'Tyler the Creator, Kanye West and more', image: '/placeholder.svg' },
  { id: 5, title: 'Daily Mix 3', description: 'Doja Cat, SZA and more', image: '/placeholder.svg' },
];

const topCharts = [
  { id: 1, title: 'Top 50 - Global', description: 'Your daily update of the most played tracks right now', image: '/placeholder.svg' },
  { id: 2, title: 'Top Songs - USA', description: 'The hottest tracks in the United States', image: '/placeholder.svg' },
  { id: 3, title: 'Viral 50', description: 'The most viral tracks on Spotify', image: '/placeholder.svg' },
  { id: 4, title: 'Trending Now', description: 'Currently trending on social and streaming', image: '/placeholder.svg' },
];

const HomeContent = () => {
  return (
    <ScrollArea className="h-full">
      <div className="p-6 pb-28">
        <PlaylistGrid 
          title="Recently played" 
          playlists={recentlyPlayed}
          seeAllLink="#"
        />
        <PlaylistGrid 
          title="Made for you" 
          playlists={madeForYou}
          seeAllLink="#"
        />
        <PlaylistGrid 
          title="Charts" 
          playlists={topCharts}
          seeAllLink="#"
        />
      </div>
    </ScrollArea>
  );
};

export default HomeContent;
