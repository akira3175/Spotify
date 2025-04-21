
import { Song, Playlist, Purchase } from '../types/music';

// Local Storage keys
const CURRENT_TRACK_KEY = 'spotify_current_track';
const PLAYING_STATE_KEY = 'spotify_playing_state';
const PURCHASED_SONGS_KEY = 'spotify_purchased_songs';
const PURCHASES_KEY = 'spotify_purchases';
const PLAYLISTS_KEY = 'spotify_playlists';
const QUEUE_KEY = 'spotify_queue';
const PLAY_HISTORY_KEY = 'spotify_play_history';

// Sample songs data
const sampleSongs: Song[] = [
  { id: 1, title: 'Bohemian Rhapsody', artist: 'Queen', artistId: 1, duration: '5:55', album: 'A Night at the Opera', imageUrl: 'https://images.unsplash.com/photo-1619961602105-16fa2a5465c2?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80', price: 1.99 },
  { id: 2, title: 'Stairway to Heaven', artist: 'Led Zeppelin', artistId: 2, duration: '8:02', album: 'Led Zeppelin IV', imageUrl: 'https://images.unsplash.com/photo-1526142684086-7ebd69df27a5?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80', price: 1.49 },
  { id: 3, title: 'Imagine', artist: 'John Lennon', artistId: 3, duration: '3:04', album: 'Imagine', imageUrl: 'https://images.unsplash.com/photo-1565345635904-040a70b3d002?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80', price: 0.99 },
  { id: 4, title: 'Billie Jean', artist: 'Michael Jackson', artistId: 4, duration: '4:54', album: 'Thriller', imageUrl: 'https://images.unsplash.com/photo-1619683717556-9b22008b9ad5?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80', price: 1.99 },
  { id: 5, title: 'Like a Rolling Stone', artist: 'Bob Dylan', artistId: 5, duration: '6:13', album: 'Highway 61 Revisited', imageUrl: 'https://images.unsplash.com/photo-1619396316238-17f37dde1a6d?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80', price: 1.29 },
  { id: 6, title: 'Hotel California', artist: 'Eagles', artistId: 6, duration: '6:30', album: 'Hotel California', imageUrl: 'https://images.unsplash.com/photo-1619961058085-b85d70a1fce2?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80', price: 1.49 },
  { id: 7, title: 'Sweet Child O\' Mine', artist: 'Guns N\' Roses', artistId: 7, duration: '5:56', album: 'Appetite for Destruction', imageUrl: 'https://images.unsplash.com/photo-1508973379184-7517410fb0bc?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80', price: 1.49 },
  { id: 8, title: 'Smells Like Teen Spirit', artist: 'Nirvana', artistId: 8, duration: '5:01', album: 'Nevermind', imageUrl: 'https://images.unsplash.com/photo-1619983081563-430f63602796?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80', price: 1.29 },
  { id: 9, title: 'Yesterday', artist: 'The Beatles', artistId: 9, duration: '2:05', album: 'Help!', imageUrl: 'https://images.unsplash.com/photo-1552422535-c45813c61732?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80', price: 0.99 },
  { id: 10, title: 'Thriller', artist: 'Michael Jackson', artistId: 4, duration: '5:57', album: 'Thriller', imageUrl: 'https://images.unsplash.com/photo-1619683717556-9b22008b9ad5?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80', price: 1.99 },
  { id: 11, title: 'Bad Romance', artist: 'Lady Gaga', artistId: 10, duration: '4:54', album: 'The Fame Monster', imageUrl: 'https://images.unsplash.com/photo-1571310100246-e0676f359b42?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80', price: 1.49 },
  { id: 12, title: 'Shape of You', artist: 'Ed Sheeran', artistId: 11, duration: '3:53', album: '÷ (Divide)', imageUrl: 'https://images.unsplash.com/photo-1621627637048-5531bd7c6634?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80', price: 1.29 },
  { id: 13, title: 'Uptown Funk', artist: 'Mark Ronson ft. Bruno Mars', artistId: 12, duration: '4:30', album: 'Uptown Special', imageUrl: 'https://images.unsplash.com/photo-1621627638304-43138384a2da?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80', price: 1.49 },
  { id: 14, title: 'Rolling in the Deep', artist: 'Adele', artistId: 13, duration: '3:48', album: '21', imageUrl: 'https://images.unsplash.com/photo-1619080972094-91af6b91e634?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80', price: 1.29 },
  { id: 15, title: 'Despacito', artist: 'Luis Fonsi ft. Daddy Yankee', artistId: 14, duration: '3:47', album: 'Vida', imageUrl: 'https://images.unsplash.com/photo-1619083082292-90a8f1a3b4e4?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80', price: 0.99 }
];

export class MusicService {
  static getAllSongs(): Song[] {
    return sampleSongs;
  }
  
  static getSongById(id: number): Song | undefined {
    return sampleSongs.find(s => s.id === id);
  }
  
  static getCurrentTrack(): Song | null {
    const stored = localStorage.getItem(CURRENT_TRACK_KEY);
    return stored ? JSON.parse(stored) : null;
  }
  
  static setCurrentTrack(song: Song | null): void {
    if (song) {
      localStorage.setItem(CURRENT_TRACK_KEY, JSON.stringify(song));
      // Lưu vào lịch sử nghe
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
    if (stored) {
      return JSON.parse(stored);
    }
    // Khởi tạo với dữ liệu mẫu nếu chưa có
    const initialPurchasedSongs = [sampleSongs[0], sampleSongs[2], sampleSongs[7], sampleSongs[11]];
    localStorage.setItem(PURCHASED_SONGS_KEY, JSON.stringify(initialPurchasedSongs));
    return initialPurchasedSongs;
  }
  
  static isPurchased(songId: number): boolean {
    const purchasedSongs = this.getPurchasedSongs();
    return purchasedSongs.some(song => song.id === songId);
  }
  
  static purchaseSong(song: Song): Purchase {
    // Kiểm tra nếu đã mua rồi
    if (this.isPurchased(song.id)) {
      throw new Error('Bạn đã sở hữu bài hát này');
    }
    
    // Thêm vào danh sách đã mua
    const purchasedSongs = this.getPurchasedSongs();
    purchasedSongs.push(song);
    localStorage.setItem(PURCHASED_SONGS_KEY, JSON.stringify(purchasedSongs));
    
    // Lưu lịch sử mua hàng
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
    if (stored) {
      return JSON.parse(stored);
    }
    
    // Khởi tạo dữ liệu mẫu nếu chưa có
    const initialPurchases: Purchase[] = [
      {
        id: 1,
        songId: 1,
        song: sampleSongs[0],
        date: new Date('2024-04-15'),
        amount: 1.99
      },
      {
        id: 2,
        songId: 3,
        song: sampleSongs[2],
        date: new Date('2024-04-10'),
        amount: 0.99
      },
      {
        id: 3,
        songId: 8,
        song: sampleSongs[7],
        date: new Date('2024-03-28'),
        amount: 1.29
      },
      {
        id: 4,
        songId: 12,
        song: sampleSongs[11],
        date: new Date('2024-03-20'),
        amount: 1.29
      }
    ];
    localStorage.setItem(PURCHASES_KEY, JSON.stringify(initialPurchases));
    return initialPurchases;
  }
  
  static getPlaylists(): Playlist[] {
    const stored = localStorage.getItem(PLAYLISTS_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    
    // Khởi tạo dữ liệu mẫu nếu chưa có
    const initialPlaylists: Playlist[] = [
      {
        id: 1,
        name: "Rock Classics",
        songs: [sampleSongs[0], sampleSongs[1], sampleSongs[6]],
        createdAt: new Date('2024-04-10')
      },
      {
        id: 2,
        name: "Chill Vibes",
        songs: [sampleSongs[2], sampleSongs[8], sampleSongs[13]],
        createdAt: new Date('2024-04-05')
      },
      {
        id: 3,
        name: "Dance Party",
        songs: [sampleSongs[9], sampleSongs[10], sampleSongs[12], sampleSongs[14]],
        createdAt: new Date('2024-03-22')
      }
    ];
    localStorage.setItem(PLAYLISTS_KEY, JSON.stringify(initialPlaylists));
    return initialPlaylists;
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
    const song = this.getSongById(songId);
    if (!song) return false;
    
    const playlists = this.getPlaylists();
    const updatedPlaylists = playlists.map(playlist => {
      if (playlist.id === playlistId) {
        // Kiểm tra nếu bài hát đã có trong playlist
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
    
    // Loại bỏ bài hát này nếu đã có trong lịch sử
    const filteredHistory = history.filter(s => s.id !== song.id);
    
    // Thêm vào đầu danh sách
    filteredHistory.unshift(song);
    
    // Giới hạn lịch sử 20 bài gần nhất
    const limitedHistory = filteredHistory.slice(0, 20);
    
    localStorage.setItem(PLAY_HISTORY_KEY, JSON.stringify(limitedHistory));
  }
  
  static clearPlayHistory(): void {
    localStorage.removeItem(PLAY_HISTORY_KEY);
  }
}
