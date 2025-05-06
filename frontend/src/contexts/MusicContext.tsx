import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from './AuthContext';
import { MusicService } from '../services/MusicService';
import { Song, Purchase, Playlist } from '../types/music';

interface MusicContextType {
  currentTrack: Song | null;
  isPlaying: boolean;
  purchasedSongs: Song[];
  purchases: Purchase[];
  playlists: Playlist[];
  likedSongs: Song[];
  play: (song: Song) => void;
  pause: () => void;
  resume: () => void;
  seek: (time: number) => void;
  downloadSong: (song: Song, format: 'mp3' | 'mp4' | 'both') => void;
  purchaseSong: (song: Song) => void;
  isPurchased: (songId: number) => boolean;
  createPlaylist: (name: string) => void;
  addSongToPlaylist: (songId: number, playlistId: number) => void;
  removeSongFromPlaylist: (songId: number, playlistId: number) => void;
  likeSong: (song: Song) => void;
  unlikeSong: (songId: number) => void;
  isLiked: (songId: number) => boolean;
}

const MusicContext = createContext<MusicContextType | null>(null);

export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [purchasedSongs, setPurchasedSongs] = useState<Song[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [likedSongs, setLikedSongs] = useState<Song[]>(() => {
    const stored = localStorage.getItem('likedSongs');
    return stored ? JSON.parse(stored) : [];
  });
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    localStorage.setItem('likedSongs', JSON.stringify(likedSongs));
  }, [likedSongs]);

  // Play: chỉ set state, không phát nhạc thực sự
  const play = (song: Song) => {
    setCurrentTrack(song);
    setIsPlaying(true);
  };

  const pause = () => {
    if (audio) {
      audio.pause();
    }
    setIsPlaying(false);
  };

  const resume = () => {
    setIsPlaying(true);
  };

  // Like/Unlike logic giữ nguyên
  const likeSong = (song: any) => {
    // Map từ kiểu API sang kiểu UI
    const mappedSong = {
      id: song.id,
      title: song.song_name || song.title,
      artist: song.artist_name || song.artist || '',
      artistId: song.artist || song.artistId,
      duration: song.duration
        ? typeof song.duration === 'number'
          ? `${Math.floor(song.duration / 60)}:${(song.duration % 60).toString().padStart(2, '0')}`
          : song.duration
        : '',
      album: song.source || song.album || '',
      imageUrl: song.cover_image || song.imageUrl || '/placeholder.svg',
      price: song.price || 0,
      audio: song.audio,
      cover_image: song.cover_image,
    };
    if (!likedSongs.find(s => s.id === mappedSong.id)) {
      setLikedSongs([...likedSongs, mappedSong]);
    }
  };

  const unlikeSong = (songId: number) => {
    setLikedSongs(likedSongs.filter(s => s.id !== songId));
  };

  const isLiked = (songId: number) => likedSongs.some(s => s.id === songId);

  // Các hàm khác giữ nguyên (purchase, playlist...)
  // ...

  return (
    <MusicContext.Provider value={{
      currentTrack,
      isPlaying,
      purchasedSongs,
      purchases,
      playlists,
      likedSongs,
      play,
      pause,
      resume,
      purchaseSong: () => {}, // mock nếu không dùng
      isPurchased: () => false, // mock nếu không dùng
      createPlaylist: () => {}, // mock nếu không dùng
      addSongToPlaylist: () => {}, // mock nếu không dùng
      removeSongFromPlaylist: () => {}, // mock nếu không dùng
      likeSong,
      unlikeSong,
      isLiked
    }}>
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = () => {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
};