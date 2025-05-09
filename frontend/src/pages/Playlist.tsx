import Sidebar from '@/components/sidebar/Sidebar';
import TopBar from '@/components/TopBar';
import MusicPlayer from '@/components/player/MusicPlayer';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useParams } from 'react-router-dom';
import { Clock, Heart, MoreHorizontal, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useContext, useEffect, useState } from 'react';
import { Playlist } from '@/types/playlist';
import { PlaylistService } from '@/services/PlaylistService';
import { Song } from '@/types/music';
import { useMusic } from '@/contexts/MusicContext';

const PlaylistPage = () => {
  const { id } = useParams<{ id: string }>();
  const playlistId = parseInt(id || '0');
  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [tracks, setTracks] = useState<Song[]>([]);
  const { play } = useMusic();

  const playSong = () => {
    console.log(tracks);
    play(tracks[0]);
  }

  useEffect(() => {
    const fetchPlaylist = async () => {
      const playlist = await PlaylistService.getPlaylistById(playlistId);
      setPlaylist(playlist);
      setTracks(playlist.song);
    };
    fetchPlaylist();
  }, [playlistId]);

  return (
    <div className="h-screen flex flex-col bg-spotify-base">
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 flex flex-col overflow-hidden">
          <TopBar />
          <ScrollArea className="flex-1 pb-28">
            {/* Playlist header */}
            <div className="flex flex-col md:flex-row items-center md:items-end gap-6 p-8 bg-gradient-to-b from-zinc-700 to-spotify-base">
              <div className="flex-shrink-0 h-60 w-60 shadow-2xl">
                <img 
                  src={playlist?.song[0]?.thumbnail || "/placeholder.svg"} 
                  alt={playlist?.playlist_name} 
                  className="h-full w-full object-cover" 
                />
              </div>
              
              <div>
                <p className="uppercase text-xs font-bold">Playlist</p>
                <h1 className="text-5xl md:text-8xl font-bold my-3">{playlist?.playlist_name}</h1>
                <p className="text-sm text-zinc-400 mb-6">{playlist?.description}</p>
                <div className="flex items-center text-sm">
                  <span className="font-bold">{playlist?.owner}</span>
                  <span className="mx-1">•</span>
                  <span>{playlist?.followers} likes</span>
                  <span className="mx-1">•</span>
                  <span>{playlist?.totalSongs} songs,</span>
                  <span className="ml-1 text-zinc-400">{playlist?.duration}</span>
                </div>
              </div>
            </div>
            
            {/* Playlist controls and tracks */}
            <div className="px-8">
              <div className="flex items-center gap-6 py-6">
                <Button className="rounded-full w-14 h-14 flex items-center justify-center bg-spotify-bright-accent hover:scale-105 hover:bg-spotify-bright-accent transition-transform"
                  onClick={playSong}
                >
                  <Play size={24} fill="black" className="text-black ml-1"/>
                </Button>
                <Button variant="ghost" className="rounded-full p-2 hover:scale-105 transition-transform">
                  <Heart size={32} className="text-spotify-subdued hover:text-white" />
                </Button>
                <Button variant="ghost" className="rounded-full p-2 hover:scale-105 transition-transform">
                  <MoreHorizontal size={32} className="text-spotify-subdued hover:text-white" />
                </Button>
              </div>
              
              {/* Tracks table */}
              <table className="w-full text-left border-collapse mb-10">
                <thead>
                  <tr className="border-b border-zinc-700 text-xs text-zinc-400">
                    <th className="px-4 py-2 w-12">#</th>
                    <th className="px-4 py-2">TITLE</th>
                    <th className="px-4 py-2">ALBUM</th>
                    <th className="px-4 py-2">DATE RELEASED</th>
                    <th className="px-4 py-2 text-right">
                      <Clock size={16} />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tracks.map((track, index) => (
                    <tr key={track.id} className="hover:bg-zinc-800 group" onClick={() => play(track)}>
                      <td className="px-4 py-3 text-zinc-400 group-hover:text-white">{index + 1}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center">
                          <div className="mr-3">
                            <img 
                              src={track.thumbnail} 
                              alt={track.song_name}
                              className="w-10 h-10" 
                            />
                          </div>
                          <div>
                            <p className="font-medium">{track.song_name}</p>
                            <p className="text-sm text-zinc-400">{track.artist.artist_name}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-zinc-400">{track.song_name}</td>
                      <td className="px-4 py-3 text-zinc-400">{new Date(track.release_date).toLocaleDateString()}</td>
                      <td className="px-4 py-3 text-zinc-400 text-right">{track.duration}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ScrollArea>
        </main>
      </div>
      <MusicPlayer />
    </div>
  );
};

export default PlaylistPage;
