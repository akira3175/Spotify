import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { SongService } from '@/services/SongService';
import { ArtistService } from '@/services/ArtistService';
import { Song } from '@/types/song';
import { Artist } from '@/types/artist';
import { Play, Pause, Heart, MoreHorizontal, Clock } from 'lucide-react';
import { useMusic } from '@/contexts/MusicContext';

const SongDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [song, setSong] = useState<Song | null>(null);
  const [artist, setArtist] = useState<Artist | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const { currentTrack, isPlaying, play, pause, resume, likeSong, unlikeSong, isLiked } = useMusic();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!id) return;
        const songData = await SongService.getSongById(parseInt(id));
        if (!songData) throw new Error('Song not found');
        setSong(songData);
        if (songData.artist) {
          const artistData = await ArtistService.getArtistById(songData.artist);
          setArtist(artistData);
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load song details');
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handlePlayPause = () => {
    if (!song) return;
    
    console.log('Song data:', song);
    console.log('Audio URL:', song.audio);
    
    if (currentTrack?.id === song.id) {
      if (isPlaying) {
        pause();
      } else {
        resume();
      }
    } else {
      const songToPlay = {
        id: song.id,
        title: song.song_name,
        artist: artist?.artist_name || 'Unknown Artist',
        artistId: song.artist,
        duration: `${Math.floor(song.duration / 60)}:${(song.duration % 60).toString().padStart(2, '0')}`,
        album: song.source,
        imageUrl: song.cover_image || '/placeholder.svg',
        price: 0,
        audio: song.audio
      };
      
      console.log('Song to play:', songToPlay);
      play(songToPlay);
    }
  };

  if (loading) {
    return (
      <ScrollArea className="h-full">
        <div className="p-6 pb-28">
          <div className="text-center">Loading song details...</div>
        </div>
      </ScrollArea>
    );
  }

  if (error || !song) {
    return (
      <ScrollArea className="h-full">
        <div className="p-6 pb-28">
          <div className="text-center text-red-500">{error || 'Song not found'}</div>
        </div>
      </ScrollArea>
    );
  }

  const isCurrentSong = currentTrack?.id === song.id;

  return (
    <ScrollArea className="h-full">
      <div className="p-0 md:p-8 pb-28">
        {/* Header: Cover + Info */}
        <div className="flex flex-col md:flex-row items-center md:items-end gap-8 md:gap-12 bg-gradient-to-b from-spotify-green/80 to-spotify-base/90 rounded-xl p-6 md:p-10 shadow-lg mb-8">
          {/* Cover */}
          <img
            src={song.cover_image || '/placeholder.svg'}
            alt={song.song_name}
            className="w-44 h-44 md:w-60 md:h-60 rounded-lg shadow-2xl object-cover bg-zinc-900"
          />
          {/* Info & Controls */}
          <div className="flex-1 text-center md:text-left">
            <span className="uppercase text-xs font-bold text-white/80 tracking-widest">Song</span>
            <h1 className="text-4xl md:text-6xl font-extrabold my-2 text-white leading-tight">{song.song_name}</h1>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-white/90 text-lg font-medium">{artist?.artist_name || 'Unknown Artist'}</span>
              <span className="text-white/60 text-base mx-2">•</span>
              <span className="text-white/60 text-base">{song.release_date ? new Date(song.release_date).getFullYear() : ''}</span>
            </div>
            <div className="flex items-center gap-4 mt-4">
              <Button
                size="lg"
                className="rounded-full bg-spotify-green hover:bg-spotify-green/90 shadow-xl"
                onClick={handlePlayPause}
              >
                {isCurrentSong && isPlaying ? <Pause className="h-7 w-7" /> : <Play className="h-7 w-7" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={isLiked(song.id) ? "text-spotify-green" : "text-white hover:text-spotify-green"}
                onClick={() => isLiked(song.id) ? unlikeSong(song.id) : likeSong(song)}
              >
                <Heart className="h-6 w-6" fill={isLiked(song.id) ? "#1DB954" : "none"} />
              </Button>
              <Button variant="ghost" size="icon" className="text-white hover:text-spotify-green">
                <MoreHorizontal className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>

        {/* Song details row (title, artist, duration) */}
        <div className="flex items-center text-zinc-400 text-sm mb-2 px-2 md:px-0">
          <div className="w-8 text-center">#</div>
          <div className="flex-1">Title</div>
          <div className="w-32">Duration</div>
        </div>
        
        <div 
          className="flex items-center p-2 rounded-md hover:bg-zinc-800 transition-colors cursor-pointer"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={handlePlayPause}
        >
          <div className="w-8 text-center">
            {isHovered ? (
              <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                {isCurrentSong && isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
            ) : (
              <span>1</span>
            )}
          </div>
          <div className="flex-1">
            <div className="font-medium">{song.song_name}</div>
            <div className="text-sm text-zinc-400">{artist?.artist_name || 'Unknown Artist'}</div>
          </div>
          <div className="w-32 flex items-center justify-end">
            <Clock className="h-4 w-4 mr-2" />
            {`${Math.floor(song.duration / 60)}:${(song.duration % 60).toString().padStart(2, '0')}`}
          </div>
        </div>

        {/* Lyrics section */}
        {song.lyrics_text && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-white mb-4">Lyrics</h2>
            <div className="bg-white/10 rounded-lg p-6 max-h-72 overflow-y-auto text-white whitespace-pre-line shadow-inner border border-white/10">
              {song.lyrics_text}
            </div>
          </div>
        )}
      </div>
    </ScrollArea>
  );
};

export default SongDetail; 