import {User} from "./user"
import { Song } from "./music"

export type Artist = {
    id: number ,
    artist_name: string,
    artist_bio: string,
    artist_picture_url: string,
    is_deleted: boolean,
    user: User,
    genres: number[],
    songs: Song[]
}