
import React, { useEffect, useState } from 'react';
import Sidebar from '@/components/sidebar/Sidebar';
import TopBar from '@/components/TopBar';
import MusicPlayer from '@/components/player/MusicPlayer';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useParams } from 'react-router-dom';
import PlaylistGrid from '@/components/content/PlaylistGrid';
import { MusicService } from '@/services/MusicService';
import { Song } from '@/types/music';

const CategoryPage = () => {
  const { id } = useParams<{ id: string }>();
  const categoryId = parseInt(id || '0');
  const [songs, setSongs] = useState<Song[]>([]);
  const [playlists, setPlaylists] = useState<any[]>([]);

  useEffect(() => {
    const fetchPlaylists = async () => {
      const songs = await MusicService.getSongsByGenre(categoryId);
      setSongs(songs);
      const playlists = convertToPlaylist(songs);
      setPlaylists(playlists);
    };

    const convertToPlaylist = (songs: Song[]): any[] => {
      return songs.map(song => ({
        id: song.id.toString(),
        title: song.song_name,
        description: song.artist.artist_name,
        image: song.thumbnail,
      }));
    };
    fetchPlaylists();
  }, [categoryId]);
  
  // Mock data - In a real app, this would come from an API based on the category ID
  const categories = [
    { id: 1, name: 'Pop', color: 'bg-pink-600', description: 'Trending pop music' },
    { id: 2, name: 'Rock', color: 'bg-orange-600', description: 'Urban beats and rhymes' },
    { id: 3, name: 'Hip-Hop', color: 'bg-red-600', description: 'Classic and modern rock' },
    { id: 4, name: 'R&B', color: 'bg-blue-600', description: 'Electronic dance music' },
    { id: 5, name: 'Electronic', color: 'bg-purple-600', description: 'Rhythm and blues' },
    { id: 6, name: 'Indie', color: 'bg-green-600', description: 'Independent artists' },
    { id: 7, name: 'Jazz', color: 'bg-yellow-600', description: 'Smooth jazz classics' },
    { id: 8, name: 'Classical', color: 'bg-teal-600', description: 'Classical masterpieces' },
  ];

  const category = categories.find(cat => cat.id === categoryId) || categories[0];

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
                playlists={playlists} 
                seeAllLink="/featured"
              />
              
              {/* <PlaylistGrid 
                title="Popular Playlists" 
                playlists={playlists} 
                seeAllLink="/popular"
              /> */}
            </div>
          </ScrollArea>
        </main>
      </div>
      <MusicPlayer />
    </div>
  );
};

export default CategoryPage;
