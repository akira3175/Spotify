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
  play: (song: Song) => void;
  pause: () => void;
  resume: () => void;
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

  // Tải dữ liệu từ MusicService khi khởi tạo
  useEffect(() => {
    if (isAuthenticated) {
      // Tải bài hát hiện tại
      const savedTrack = MusicService.getCurrentTrack();
      if (savedTrack) {
        setCurrentTrack(savedTrack);
      }
      
      // Tải trạng thái phát nhạc
      setIsPlaying(MusicService.getIsPlaying());
      
      // Tải danh sách bài hát đã mua
      setPurchasedSongs(MusicService.getPurchasedSongs());
      
      // Tải lịch sử mua hàng
      setPurchases(MusicService.getPurchaseHistory());
      
      // Tải danh sách playlist
      setPlaylists(MusicService.getPlaylists());
    }
  }, [isAuthenticated]);

  // Lấy audioUrl từ API nếu không có
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

  // Play: phát một bài hát
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
      // Lấy audioUrl nếu không có sẵn
      const audioUrl = song.audioUrl || (await fetchAudioUrl(song.id));
      
      // Dừng bài hát hiện tại nếu đang phát
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }

      // Tạo và phát audio mới
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
      setCurrentTrack({ ...song, audioUrl });
      setIsPlaying(true);

      // Lưu thông tin vào service
      MusicService.setCurrentTrack({ ...song, audioUrl });
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

  // Pause: tạm dừng
  const pause = () => {
    if (audio) {
      audio.pause();
    }
    setIsPlaying(false);
    MusicService.setIsPlaying(false);
  };

  // Resume: tiếp tục phát
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

  // Mua bài hát
  const purchaseSong = (song: Song) => {
    try {
      // Kiểm tra đã mua hay chưa
      if (MusicService.isPurchased(song.id)) {
        toast({
          title: "Đã sở hữu",
          description: "Bạn đã sở hữu bài hát này.",
        });
        return;
      }

      // Thực hiện mua
      const purchase = MusicService.purchaseSong(song);
      
      // Cập nhật state
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

  // Kiểm tra đã mua bài hát chưa
  const isPurchased = (songId: number): boolean => {
    return MusicService.isPurchased(songId);
  };

  // Tạo playlist mới
  const createPlaylist = (name: string) => {
    const newPlaylist = MusicService.createPlaylist(name);
    setPlaylists([...playlists, newPlaylist]);
    
    toast({
      title: "Tạo playlist thành công",
      description: `Playlist "${name}" đã được tạo.`,
    });
  };

  // Thêm bài hát vào playlist
  const addSongToPlaylist = (songId: number, playlistId: number) => {
    const song = MusicService.getSongById(songId);
    if (!song) return;
    
    const success = MusicService.addSongToPlaylist(songId, playlistId);
    
    if (success) {
      // Cập nhật state
      const updatedPlaylists = playlists.map(playlist => {
        if (playlist.id === playlistId) {
          // Kiểm tra bài hát đã có trong playlist
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

  // Xóa bài hát khỏi playlist
  const removeSongFromPlaylist = (songId: number, playlistId: number) => {
    const success = MusicService.removeSongFromPlaylist(songId, playlistId);
    
    if (success) {
      // Cập nhật state
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
      play,
      pause,
      resume,
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