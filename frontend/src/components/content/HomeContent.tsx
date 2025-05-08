import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PlaylistGrid from './PlaylistGrid';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SongService } from '@/services/SongService';
import { ArtistService } from '@/services/ArtistService';
import { Song } from '@/types/music';

interface Playlist {
  id: string;
  title: string;
  description: string;
  image: string;
}

// Mock data for songs
const popularSongs: Playlist[] = [
  { id: '1', title: 'Blinding Lights', description: 'The Weeknd - After Hours', image: '/placeholder.svg' },
  { id: '2', title: 'Stay', description: 'The Kid LAROI, Justin Bieber - F*CK LOVE 3', image: '/placeholder.svg' },
  { id: '3', title: 'Shape of You', description: 'Ed Sheeran - ÷ (Divide)', image: '/placeholder.svg' },
  { id: '4', title: 'Dynamite', description: 'BTS - Dynamite (Single)', image: '/placeholder.svg' },
  { id: '5', title: 'Levitating', description: 'Dua Lipa - Future Nostalgia', image: '/placeholder.svg' },
];

const trendingSongs: Playlist[] = [
  { id: '1', title: 'Good 4 U', description: 'Olivia Rodrigo - SOUR', image: '/placeholder.svg' },
  { id: '2', title: 'Montero', description: 'Lil Nas X - MONTERO', image: '/placeholder.svg' },
  { id: '3', title: 'Peaches', description: 'Justin Bieber - Justice', image: '/placeholder.svg' },
  { id: '4', title: 'Save Your Tears', description: 'The Weeknd - After Hours', image: '/placeholder.svg' },
];

const localSongs: Playlist[] = [
  { id: '1', title: 'Hai Triệu Năm', description: 'Đen Vâu - Đen Vâu', image: '/placeholder.svg' },
  { id: '2', title: 'Chúng Ta Của Hiện Tại', description: 'Sơn Tùng M-TP - Chúng Ta Của Hiện Tại', image: '/placeholder.svg' },
  { id: '3', title: 'See Tình', description: 'Hoàng Thùy Linh - See Tình', image: '/placeholder.svg' },
];

const HomeContent = () => {
  const navigate = useNavigate();
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching songs...');
        const songsData = await SongService.getSong();
        console.log('Songs data:', songsData);
        setSongs(Array.isArray(songsData) ? songsData : [songsData]);

        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSongClick = (songId: string) => {
    navigate(`/song/${songId}`);
  };

  const handlePlaylistClick = (id: string) => {
    // Handle playlist click here
    console.log('Playlist clicked:', id);
  };

  const apiSongs: Playlist[] = songs.map(song => ({
    id: song.id.toString(),
    title: song.song_name,
    description: song.artist.artist_name,
    image: song.thumbnail || '/placeholder.svg'
  }));

  if (loading) {
    return (
      <ScrollArea className="h-full">
        <div className="p-6 pb-28">
          <div className="text-center">Loading songs...</div>
        </div>
      </ScrollArea>
    );
  }

  if (error) {
    return (
      <ScrollArea className="h-full">
        <div className="p-6 pb-28">
          <div className="text-center text-red-500">{error}</div>
        </div>
      </ScrollArea>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="p-6 pb-28">
        {/* Display songs from API */}
        <PlaylistGrid 
          title="Songs from API" 
          playlists={apiSongs}
          onPlaylistClick={handleSongClick}
          seeAllLink="#"
        />

        {/* Display mock data */}
        <PlaylistGrid 
          title="Popular Songs" 
          playlists={popularSongs}
          seeAllLink="#"
        />
        <PlaylistGrid 
          title="Trending Songs" 
          playlists={trendingSongs}
          seeAllLink="#"
        />
        <PlaylistGrid 
          title="Local Songs" 
          playlists={localSongs}
          seeAllLink="#"
        />
      </div>
    </ScrollArea>
  );
};

export default HomeContent;