import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from './AuthContext';
import { Song, Purchase, Playlist } from '../types/music';

interface MusicContextType {
  currentTrack: Song | null;
  isPlaying: boolean;
  progress: number;
  duration: number;
  purchasedSongs: Song[];
  purchases: Purchase[];
  playlists: Playlist[];
  likedSongs: Song[];
  volume: number;
  setVolume: (volume: number) => void;
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
  const [volume, setVolume] = useState(1);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTrack, setCurrentTrack] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [purchasedSongs, setPurchasedSongs] = useState<Song[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [likedSongs, setLikedSongs] = useState<Song[]>(() => {
    const stored = localStorage.getItem('likedSongs');
    return stored ? JSON.parse(stored) : [];
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    localStorage.setItem('likedSongs', JSON.stringify(likedSongs));
  }, [likedSongs]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
  
    const updateProgress = () => {
      setProgress(audio.currentTime);
      setDuration(audio.duration || 0);
    };
  
    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
    };
  
    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', handleEnded);
  
    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [audioRef.current]);  

  const play = (song: Song) => {
    if (audioRef.current) {
      audioRef.current.pause();
    }

    const audio = new Audio(song.audio);
    audioRef.current = audio;
    audio.play()
      .then(() => setIsPlaying(true))
      .catch((err) => {
        console.error("Playback error:", err);
        toast({ title: "Không thể phát bài hát", description: "Vui lòng thử lại sau." });
        setIsPlaying(false);
      });

    audio.volume = volume;

    setCurrentTrack(song);
  };

  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setIsPlaying(false);
  };

  const resume = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
    setIsPlaying(true);
  };

  const seek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const likeSong = (song: Song) => {
    const mappedSong = {
      id: song.id,
      song_name: song.song_name,
      artist: song.artist,
      duration: song.duration,
      album: song.album,
      imageUrl: song.thumbnail || '/placeholder.svg',
      price: song.price || 0,
      audio: song.audio,
      cover_image: song.thumbnail,
      genres: song.genres,
      is_deleted: song.is_deleted,
      release_date: song.release_date,
      source: song.source,
      lyrics_text: song.lyrics_text,
    };
    if (!likedSongs.find(s => s.id === mappedSong.id)) {
      setLikedSongs([...likedSongs, mappedSong]);
    }
  };

  const unlikeSong = (songId: number) => {
    setLikedSongs(likedSongs.filter(s => s.id !== songId));
  };

  const isLiked = (songId: number) => likedSongs.some(s => s.id === songId);

  const downloadSong = (song: Song, format: 'mp3' | 'mp4' | 'both') => {
    window.open(song.audio, '_blank');
  };

  return (
    <MusicContext.Provider
      value={{
        currentTrack,
        isPlaying,
        progress,
        duration,
        purchasedSongs,
        purchases,
        playlists,
        likedSongs,
        volume,
        setVolume,
        play,
        pause,
        resume,
        seek,
        downloadSong,
        purchaseSong: () => {},
        isPurchased: () => false,
        createPlaylist: () => {},
        addSongToPlaylist: () => {},
        removeSongFromPlaylist: () => {},
        likeSong,
        unlikeSong,
        isLiked
      }}
    >
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
