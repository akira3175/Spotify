import { Song, Purchase } from '../types/music';
import { api } from '@/config/api';

// Local Storage keys
const CURRENT_TRACK_KEY = 'spotify_current_track';
const PLAYING_STATE_KEY = 'spotify_playing_state';
const PURCHASED_SONGS_KEY = 'spotify_purchased_songs';
const PURCHASES_KEY = 'spotify_purchases';
const QUEUE_KEY = 'spotify_queue';
const PLAY_HISTORY_KEY = 'spotify_play_history';

export class MusicService {
  static async getAllSongs(): Promise<Song[]> {
    try {
      const response = await api.get('/songs/');

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

      return songsData;
    } catch (error: any) {
      console.error('MusicService: Error fetching songs:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      throw error;
    }
  }

  static async getSongsByGenre(genreId: number): Promise<Song[]> {
    try {
      const response = await api.get(`/songs/?genre_id=${genreId}`);
      return response.data;
    } catch (error: any) {
      console.error('MusicService: Error fetching songs by genre:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      throw error;
    }
  }
  

  static async searchSongs(query: string): Promise<Song[]> {
    try {
      const response = await api.get(`/songs/?search=${query}`);
      return response.data;
    } catch (error: any) {
      console.error('MusicService: Error searching songs:', {
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
