import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from './AuthContext';
import { Song } from '../types/music';
import { Playlist } from '../types/playlist';
import { PlaylistService } from '@/services/PlaylistService';
import { Order } from '@/types/purchase';
import { PurchaseService } from '@/services/PurchaseService';

interface MusicContextType {
  currentTrack: Song | null;
  isPlaying: boolean;
  progress: number;
  duration: number;
  purchasedSongs: Song[];
  purchases: Order[];
  playlists: Playlist[];
  likedSongs: Song[];
  volume: number;
  setVolume: (volume: number) => void;
  play: (song: Song) => void;
  pause: () => void;
  resume: () => void;
  seek: (time: number) => void;
  downloadSong: (song: Song, format: 'mp3' | 'mp4' | 'both') => void;
  purchaseSong: (song: Song) => Promise<Order>;
  isPurchased: (songId: number) => Promise<boolean>;
  getPurchases: () => Promise<Order[]>;
  createPlaylist: (name: string) => Promise<Playlist>;
  addSongToPlaylist: (songId: number, playlist: Playlist) => Promise<Playlist>;
  removeSongFromPlaylist: (songId: number, playlistId: number) => void;
  likeSong: (song: Song) => void;
  unlikeSong: (songId: number) => void;
  isLiked: (songId: number) => boolean;
  audioRef: React.MutableRefObject<HTMLAudioElement | null>;
}

const MusicContext = createContext<MusicContextType | null>(null);

export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [volume, setVolume] = useState(1);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTrack, setCurrentTrack] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [purchasedSongs, setPurchasedSongs] = useState<Song[]>([]);
  const [purchases, setPurchases] = useState<Order[]>([]);
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
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    const fetchPlaylists = async () => {
      if (!isAuthenticated) return;
      const playlists = await PlaylistService.getPlaylist();
      setPlaylists(playlists);
    };
    fetchPlaylists();
  }, [isAuthenticated]);

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

  const play = async (song: Song) => {
    const hasPaid = await isPurchased(song.id);
    console.log(hasPaid);
    console.log(typeof hasPaid);
    console.log(song)
    if (song.price > 0 && !hasPaid) {
      toast({ title: "Bài hát này yêu cầu mua", description: "Bạn có thể mua bài hát tại đây" });
      return;
    }

    if (audioRef.current) {
      audioRef.current.pause();
    }

    const audio = new Audio(song.audio);
    audioRef.current = audio;
    audio.loop = false;
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

  const createPlaylist = async (playlist_name: string) => {
    const playlist = {
      id: 0,
      playlist_name: playlist_name,
      description: 'New playlist',
      is_public: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_deleted: false,
      playlist_cover_url: '',
      song: [],
      price: 0,
    }
    const response = await PlaylistService.createPlaylist(playlist);
    setPlaylists([...playlists, response]);
    toast({ title: "Playlist đã được tạo", description: "Bạn có thể thêm bài hát vào playlist" });
    return response;
  }

  const addSongToPlaylist = async (songId: number, playlist: Playlist) => {
    const updatedSongs = [...playlist.song.map(s => s.id), songId];
    const updatedPlaylist = { ...playlist, song_id: updatedSongs };
    const response = await PlaylistService.updatePlaylist(playlist.id, updatedPlaylist as unknown as Playlist);
    setPlaylists([...playlists, response]);
    toast({ title: "Bài hát đã được thêm vào playlist", description: "Bạn có thể xem playlist tại đây" });
    return response;
  }

  const isPurchased = async (songId: number): Promise<boolean> => {
    const hasPaid = await PurchaseService.checkSongPaid(songId);
    return hasPaid;
  }

  const getPurchases = async (): Promise<Order[]> => {
    const purchases = await PurchaseService.getOrders();
    return purchases;
  }

  const purchaseSong = async (song: Song): Promise<Order> => {
    const purchase = await PurchaseService.createOrder(song);
    setPurchases([...purchases, purchase]);
    toast({ title: "Bài hát đã được mua", description: "Bạn có thể xem lịch sử mua hàng tại đây" });
    return purchase;
  }
  

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
        purchaseSong,
        isPurchased,
        getPurchases,
        createPlaylist,
        addSongToPlaylist,
        removeSongFromPlaylist: () => {},
        likeSong,
        unlikeSong,
        isLiked,
        audioRef
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
