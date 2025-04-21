
export type Song = {
  id: number;
  title: string;
  artist: string;
  artistId: number;
  duration: string;
  album: string;
  imageUrl?: string;
  price: number;
};

export type Purchase = {
  id: number;
  songId: number;
  song: Song;
  date: Date;
  amount: number;
};

export type Playlist = {
  id: number;
  name: string;
  songs: Song[];
  createdAt: Date;
};
