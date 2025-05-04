import { Song } from "./music"

export type Album = {
    id: number,
    album_name: string,
    release_date: Date,
    album_cover_url: string,
    is_deleted: boolean,
    artist: number,
    song: Song[]
}