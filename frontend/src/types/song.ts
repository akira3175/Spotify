export type Song= {
    id: number,
    song_name: string,
    duration: number,
    audio: string,
    plays: number,
    lyrics_text: string,
    source: string,
    is_deleted: boolean,
    release_date: Date,
    artist: number,
    genres: number[]
}