import { Artist } from "./artist";
import { Album } from "./album";

export type Genre = {
  id: number;
  name: string;
  description: string;
}

export type Song = {
  id: number;
  song_name: string;
  artist: Artist;
  duration: number;
  album: Album;
  audio?: string;
  lyrics_text?: string;
  price: number;
  source?: string;
  genres: Genre[];
  is_deleted: boolean;
  release_date: Date;
  thumbnail?: string;
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
