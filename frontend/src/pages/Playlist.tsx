
import React from 'react';
import Sidebar from '@/components/sidebar/Sidebar';
import TopBar from '@/components/TopBar';
import MusicPlayer from '@/components/player/MusicPlayer';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useParams } from 'react-router-dom';
import { Clock, Heart, MoreHorizontal, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PlaylistPage = () => {
  const { id } = useParams<{ id: string }>();
  const playlistId = parseInt(id || '0');
  
  // Mock data - In a real app, this would come from an API based on the playlist ID
  const playlists = [
    { 
      id: 1, 
      title: "Today's Top Hits", 
      description: "Ed Sheeran is on top of the Hottest 50!", 
      image: "https://placehold.co/300x300?text=Top+Hits",
      followers: "28,719,771",
      owner: "Spotify",
      totalSongs: 50,
      duration: "2 hr 42 min" 
    },
    { 
      id: 2, 
      title: "RapCaviar", 
      description: "New music from Drake, Lil Baby and more", 
      image: "https://placehold.co/300x300?text=RapCaviar",
      followers: "14,382,991",
      owner: "Spotify",
      totalSongs: 50,
      duration: "2 hr 55 min" 
    }
  ];

  const playlist = playlists.find(p => p.id === playlistId) || playlists[0];
  
  // Mock tracks data
  const tracks = [
    { id: 1, title: "Shape of You", artist: "Ed Sheeran", album: "÷", added: "3 days ago", duration: "3:54", plays: "3,157,293,591" },
    { id: 2, title: "Blinding Lights", artist: "The Weeknd", album: "After Hours", added: "5 days ago", duration: "3:22", plays: "3,023,390,499" },
    { id: 3, title: "Dance Monkey", artist: "Tones and I", album: "The Kids Are Coming", added: "1 week ago", duration: "3:29", plays: "2,804,184,013" },
    { id: 4, title: "Someone You Loved", artist: "Lewis Capaldi", album: "Divinely Uninspired...", added: "2 weeks ago", duration: "3:02", plays: "2,578,058,287" },
    { id: 5, title: "Stay", artist: "The Kid LAROI, Justin Bieber", album: "F*CK LOVE 3+", added: "3 weeks ago", duration: "2:21", plays: "2,490,501,325" },
    { id: 6, title: "Rockstar", artist: "Post Malone ft. 21 Savage", album: "beerbongs & bentleys", added: "1 month ago", duration: "3:38", plays: "2,477,723,263" },
    { id: 7, title: "One Dance", artist: "Drake ft. Wizkid & Kyla", album: "Views", added: "1 month ago", duration: "2:54", plays: "2,425,538,987" },
    { id: 8, title: "Closer", artist: "The Chainsmokers ft. Halsey", album: "Collage", added: "2 months ago", duration: "4:04", plays: "2,415,319,845" },
    { id: 9, title: "Sunflower", artist: "Post Malone, Swae Lee", album: "Spider-Man: Into the Spider-Verse", added: "2 months ago", duration: "2:38", plays: "2,353,739,341" },
    { id: 10, title: "Believer", artist: "Imagine Dragons", album: "Evolve", added: "3 months ago", duration: "3:24", plays: "2,326,078,689" }
  ];

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
                  src={playlist.image} 
                  alt={playlist.title} 
                  className="h-full w-full object-cover" 
                />
              </div>
              
              <div>
                <p className="uppercase text-xs font-bold">Playlist</p>
                <h1 className="text-5xl md:text-8xl font-bold my-3">{playlist.title}</h1>
                <p className="text-sm text-zinc-400 mb-6">{playlist.description}</p>
                <div className="flex items-center text-sm">
                  <span className="font-bold">{playlist.owner}</span>
                  <span className="mx-1">•</span>
                  <span>{playlist.followers} likes</span>
                  <span className="mx-1">•</span>
                  <span>{playlist.totalSongs} songs,</span>
                  <span className="ml-1 text-zinc-400">{playlist.duration}</span>
                </div>
              </div>
            </div>
            
            {/* Playlist controls and tracks */}
            <div className="px-8">
              <div className="flex items-center gap-6 py-6">
                <Button className="rounded-full w-14 h-14 flex items-center justify-center bg-spotify-bright-accent hover:scale-105 hover:bg-spotify-bright-accent transition-transform">
                  <Play size={24} fill="black" className="text-black ml-1" />
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
                    <th className="px-4 py-2">DATE ADDED</th>
                    <th className="px-4 py-2 text-right">
                      <Clock size={16} />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tracks.map((track, index) => (
                    <tr key={track.id} className="hover:bg-zinc-800 group">
                      <td className="px-4 py-3 text-zinc-400 group-hover:text-white">{index + 1}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center">
                          <div className="mr-3">
                            <img 
                              src={`https://placehold.co/40x40?text=${track.id}`} 
                              alt={track.title}
                              className="w-10 h-10" 
                            />
                          </div>
                          <div>
                            <p className="font-medium">{track.title}</p>
                            <p className="text-sm text-zinc-400">{track.artist}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-zinc-400">{track.album}</td>
                      <td className="px-4 py-3 text-zinc-400">{track.added}</td>
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
