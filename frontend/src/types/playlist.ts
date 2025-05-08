import { Song } from "./music";

export interface Playlist {
    id: number;
    playlist_name: string;
    description: string;
    created_at: string;
    is_public: boolean;
    playlist_cover_url: string;
    is_deleted: boolean;
    song: Song[];
    price: number;
    [key: string]: any;
}
