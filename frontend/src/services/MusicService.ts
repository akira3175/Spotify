import { Song, Playlist, Purchase } from '../types/music';
import { api } from '@/config/api';

// Local Storage keys
const CURRENT_TRACK_KEY = 'spotify_current_track';
const PLAYING_STATE_KEY = 'spotify_playing_state';
const PURCHASED_SONGS_KEY = 'spotify_purchased_songs';
const PURCHASES_KEY = 'spotify_purchases';
const PLAYLISTS_KEY = 'spotify_playlists';
const QUEUE_KEY = 'spotify_queue';
const PLAY_HISTORY_KEY = 'spotify_play_history';

interface ApiSong {
  id: number;
  song_name: string;
  artist: string;
  duration: number;
  audio: string | null;
  plays: number;
}

export class MusicService {
  static async getAllSongs(): Promise<Song[]> {
    try {
      console.log('MusicService: Making API call to /songs/...');
      const response = await api.get('/songs/');
      
      console.log('MusicService: Full API response:', {
        status: response.status,
        data: response.data,
        dataType: typeof response.data,
        isArray: Array.isArray(response.data)
      });

      if (!response || !response.data) {
        console.warn('MusicService: No data in API response');
        return [];
      }

      let songsData = response.data;

      // If response is paginated, extract the results
      if (songsData.results) {
        console.log('MusicService: Found paginated data structure:', songsData);
        songsData = songsData.results;
      }

      if (!Array.isArray(songsData)) {
        console.warn('MusicService: Data is not an array:', typeof songsData);
        return [];
      }

      // Transform the data into Song objects with proper validation
      const validSongs = songsData
        .filter(song => {
          if (!song || typeof song !== 'object') {
            console.warn('MusicService: Invalid song data:', song);
            return false;
          }
          return true;
        })
        .map((song: ApiSong) => {
          const processedSong = {
            id: song.id,
            title: song.song_name || 'Unknown Title',
            artist: song.artist || 'Artist Name',
            artistId: 1,
            duration: song.duration ? `${Math.floor(song.duration / 60)}:${(song.duration % 60).toString().padStart(2, '0')}` : '0:00',
            album: 'Unknown Album',
            imageUrl: '/placeholder.svg',
            price: 0,
            audioUrl: song.audio || null
          };
          console.log('MusicService: Processed song:', processedSong);
          return processedSong;
        });

      console.log('MusicService: Final processed songs:', validSongs);
      return validSongs;
    } catch (error: any) {
      console.error('MusicService: Error fetching songs:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      throw error;
    }
  }
  
  static getCurrentTrack(): Song | null {
    const stored = localStorage.getItem(CURRENT_TRACK_KEY);
    return stored ? JSON.parse(stored) : null;
  }
  
  static setCurrentTrack(song: Song | null): void {
    if (song) {
      localStorage.setItem(CURRENT_TRACK_KEY, JSON.stringify(song));
      // Add to play history
      this.addToPlayHistory(song);
    } else {
      localStorage.removeItem(CURRENT_TRACK_KEY);
    }
  }
  
  static getIsPlaying(): boolean {
    return localStorage.getItem(PLAYING_STATE_KEY) === 'true';
  }
  
  static setIsPlaying(isPlaying: boolean): void {
    localStorage.setItem(PLAYING_STATE_KEY, isPlaying.toString());
  }
  
  static getPurchasedSongs(): Song[] {
    const stored = localStorage.getItem(PURCHASED_SONGS_KEY);
    return stored ? JSON.parse(stored) : [];
  }
  
  static isPurchased(songId: number): boolean {
    const purchasedSongs = this.getPurchasedSongs();
    return purchasedSongs.some(song => song.id === songId);
  }
  
  static purchaseSong(song: Song): Purchase {
    if (this.isPurchased(song.id)) {
      throw new Error('You already own this song');
    }
    
    const purchasedSongs = this.getPurchasedSongs();
    purchasedSongs.push(song);
    localStorage.setItem(PURCHASED_SONGS_KEY, JSON.stringify(purchasedSongs));
    
    const purchases = this.getPurchaseHistory();
    const newPurchase: Purchase = {
      id: purchases.length + 1,
      songId: song.id,
      song: song,
      date: new Date(),
      amount: song.price
    };
    purchases.push(newPurchase);
    localStorage.setItem(PURCHASES_KEY, JSON.stringify(purchases));
    
    return newPurchase;
  }
  
  static getPurchaseHistory(): Purchase[] {
    const stored = localStorage.getItem(PURCHASES_KEY);
    return stored ? JSON.parse(stored) : [];
  }
  
  static getPlaylists(): Playlist[] {
    const stored = localStorage.getItem(PLAYLISTS_KEY);
    return stored ? JSON.parse(stored) : [];
  }
  
  static getPlaylistById(id: number): Playlist | undefined {
    const playlists = this.getPlaylists();
    return playlists.find(p => p.id === id);
  }
  
  static createPlaylist(name: string): Playlist {
    const playlists = this.getPlaylists();
    const newPlaylist: Playlist = {
      id: Date.now(),
      name,
      songs: [],
      createdAt: new Date()
    };
    playlists.push(newPlaylist);
    localStorage.setItem(PLAYLISTS_KEY, JSON.stringify(playlists));
    return newPlaylist;
  }
  
  static addSongToPlaylist(songId: number, playlistId: number): boolean {
    const song = this.getPurchasedSongs().find(s => s.id === songId);
    if (!song) return false;
    
    const playlists = this.getPlaylists();
    const updatedPlaylists = playlists.map(playlist => {
      if (playlist.id === playlistId) {
        if (playlist.songs.some(s => s.id === songId)) {
          return playlist;
        }
        return { ...playlist, songs: [...playlist.songs, song] };
      }
      return playlist;
    });
    
    localStorage.setItem(PLAYLISTS_KEY, JSON.stringify(updatedPlaylists));
    return true;
  }
  
  static removeSongFromPlaylist(songId: number, playlistId: number): boolean {
    const playlists = this.getPlaylists();
    const updatedPlaylists = playlists.map(playlist => {
      if (playlist.id === playlistId) {
        return { 
          ...playlist, 
          songs: playlist.songs.filter(s => s.id !== songId) 
        };
      }
      return playlist;
    });
    
    localStorage.setItem(PLAYLISTS_KEY, JSON.stringify(updatedPlaylists));
    return true;
  }
  
  static getQueue(): Song[] {
    const stored = localStorage.getItem(QUEUE_KEY);
    return stored ? JSON.parse(stored) : [];
  }
  
  static setQueue(songs: Song[]): void {
    localStorage.setItem(QUEUE_KEY, JSON.stringify(songs));
  }
  
  static addToQueue(song: Song): void {
    const queue = this.getQueue();
    queue.push(song);
    this.setQueue(queue);
  }
  
  static clearQueue(): void {
    localStorage.removeItem(QUEUE_KEY);
  }
  
  static getPlayHistory(): Song[] {
    const stored = localStorage.getItem(PLAY_HISTORY_KEY);
    return stored ? JSON.parse(stored) : [];
  }
  
  static addToPlayHistory(song: Song): void {
    const history = this.getPlayHistory();
    const filteredHistory = history.filter(s => s.id !== song.id);
    filteredHistory.unshift(song);
    const limitedHistory = filteredHistory.slice(0, 20);
    localStorage.setItem(PLAY_HISTORY_KEY, JSON.stringify(limitedHistory));
  }
  
  static clearPlayHistory(): void {
    localStorage.removeItem(PLAY_HISTORY_KEY);
  }
}
