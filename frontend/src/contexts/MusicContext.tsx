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
  audio: HTMLAudioElement | null;
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
}

const MusicContext = createContext<MusicContextType | null>(null);

export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [purchasedSongs, setPurchasedSongs] = useState<Song[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      const savedTrack = MusicService.getCurrentTrack();
      if (savedTrack) {
        setCurrentTrack(savedTrack);
      }
      setIsPlaying(MusicService.getIsPlaying());
      setPurchasedSongs(MusicService.getPurchasedSongs());
      setPurchases(MusicService.getPurchaseHistory());
      setPlaylists(MusicService.getPlaylists());
    }
  }, [isAuthenticated]);

  const fetchAudioUrl = async (songId: number | string): Promise<string> => {
    try {
      const response = await fetch(`/api/song/${songId}/audio`);
      if (!response.ok) throw new Error('Failed to fetch audio');
      const data = await response.json();
      return data.audioUrl;
    } catch (error) {
      console.error('MusicContext: Error fetching audio URL:', error);
      throw error;
    }
  };

  const fetchVideoUrl = async (songId: number | string): Promise<string> => {
    try {
      const response = await fetch(`/api/song/${songId}/video`);
      if (!response.ok) throw new Error('Failed to fetch video');
      const data = await response.json();
      return data.videoUrl;
    } catch (error) {
      console.error('MusicContext: Error fetching video URL:', error);
      throw error;
    }
  };

  const play = async (song: Song) => {
    if (!MusicService.isPurchased(song.id)) {
      toast({
        variant: "destructive",
        title: "Không thể phát",
        description: "Bạn cần mua bài hát này trước khi phát.",
      });
      return;
    }

    try {
      const audioUrl = song.audioUrl || (await fetchAudioUrl(song.id));
      
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }

      const newAudio = new Audio(audioUrl);
      newAudio.play().catch((error) => {
        toast({
          variant: "destructive",
          title: "Lỗi phát nhạc",
          description: "Không thể phát bài hát này.",
        });
        console.error('MusicContext: Error playing audio:', error);
      });
      
      setAudio(newAudio);
      setCurrentTrack(song.audioUrl ? song : { ...song, audioUrl });
      setIsPlaying(true);

      MusicService.setCurrentTrack(song.audioUrl ? song : { ...song, audioUrl });
      MusicService.setIsPlaying(true);

      toast({
        title: "Đang phát",
        description: `${song.title} - ${song.artist}`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Không thể tải tệp âm thanh.",
      });
      console.error('MusicContext: Error in play:', error);
    }
  };

  const pause = () => {
    if (audio) {
      audio.pause();
    }
    setIsPlaying(false);
    MusicService.setIsPlaying(false);
  };

  const resume = () => {
    if (currentTrack && audio) {
      audio.play().catch((error) => {
        toast({
          variant: "destructive",
          title: "Lỗi phát nhạc",
          description: "Không thể tiếp tục phát bài hát.",
        });
        console.error('MusicContext: Error resuming audio:', error);
      });
      setIsPlaying(true);
      MusicService.setIsPlaying(true);
    }
  };

  const seek = (time: number) => {
    if (audio) {
      audio.currentTime = time;
    }
  };

  const downloadSong = async (song: Song, format: 'mp3' | 'mp4' | 'both') => {
    if (!MusicService.isPurchased(song.id)) {
      toast({
        variant: "destructive",
        title: "Không thể tải",
        description: "Bạn cần mua bài hát này trước khi tải.",
      });
      return;
    }

    try {
      const downloadFile = async (url: string, fileName: string) => {
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      };

      if (format === 'mp3' || format === 'both') {
        const audioUrl = song.audioUrl || (await fetchAudioUrl(song.id));
        if (!audioUrl) {
          throw new Error('Audio URL not available');
        }
        await downloadFile(audioUrl, `${song.title} - ${song.artist}.mp3`);
      }

      if (format === 'mp4' || format === 'both') {
        const videoUrl = song.videoUrl || (await fetchVideoUrl(song.id));
        if (!videoUrl) {
          throw new Error('Video URL not available');
        }
        await downloadFile(videoUrl, `${song.title} - ${song.artist}.mp4`);
      }

      toast({
        title: "Đang tải",
        description: `Đang tải "${song.title}" của ${song.artist} (${format}).`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: `Không thể tải ${format === 'both' ? 'bài hát' : format.toUpperCase()}.`,
      });
      console.error('MusicContext: Error downloading song:', error);
    }
  };

  const purchaseSong = (song: Song) => {
    try {
      if (MusicService.isPurchased(song.id)) {
        toast({
          title: "Đã sở hữu",
          description: "Bạn đã sở hữu bài hát này.",
        });
        return;
      }

      const purchase = MusicService.purchaseSong(song);
      setPurchasedSongs([...purchasedSongs, song]);
      setPurchases([...purchases, purchase]);
      
      toast({
        title: "Mua thành công",
        description: `Bạn đã mua "${song.title}" của ${song.artist}.`,
      });
    } catch (error) {
      if (error instanceof Error) {
        toast({
          variant: "destructive",
          title: "Lỗi",
          description: error.message,
        });
      }
    }
  };

  const isPurchased = (songId: number): boolean => {
    return MusicService.isPurchased(songId);
  };

  const createPlaylist = (name: string) => {
    const newPlaylist = MusicService.createPlaylist(name);
    setPlaylists([...playlists, newPlaylist]);
    
    toast({
      title: "Tạo playlist thành công",
      description: `Playlist "${name}" đã được tạo.`,
    });
  };

  const addSongToPlaylist = (songId: number, playlistId: number) => {
    const song = MusicService.getSongById(songId);
    if (!song) return;
    
    const success = MusicService.addSongToPlaylist(songId, playlistId);
    
    if (success) {
      const updatedPlaylists = playlists.map(playlist => {
        if (playlist.id === playlistId) {
          if (playlist.songs.some(s => s.id === songId)) {
            toast({
              variant: "destructive",
              title: "Đã có trong playlist",
              description: `"${song.title}" đã có trong playlist này.`,
            });
            return playlist;
          }
          
          return { ...playlist, songs: [...playlist.songs, song] };
        }
        return playlist;
      });
      
      setPlaylists(updatedPlaylists);
      
      toast({
        title: "Đã thêm bài hát",
        description: `"${song.title}" đã được thêm vào playlist.`,
      });
    }
  };

  const removeSongFromPlaylist = (songId: number, playlistId: number) => {
    const success = MusicService.removeSongFromPlaylist(songId, playlistId);
    
    if (success) {
      const updatedPlaylists = playlists.map(playlist => {
        if (playlist.id === playlistId) {
          const songToRemove = playlist.songs.find(s => s.id === songId);
          if (songToRemove) {
            toast({
              title: "Đã xóa bài hát",
              description: `"${songToRemove.title}" đã được xóa khỏi playlist.`,
            });
            return { ...playlist, songs: playlist.songs.filter(s => s.id !== songId) };
          }
        }
        return playlist;
      });
      
      setPlaylists(updatedPlaylists);
    }
  };

  return (
    <MusicContext.Provider value={{
      currentTrack,
      isPlaying,
      purchasedSongs,
      purchases,
      playlists,
      audio,
      play,
      pause,
      resume,
      seek,
      downloadSong,
      purchaseSong,
      isPurchased,
      createPlaylist,
      addSongToPlaylist,
      removeSongFromPlaylist
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