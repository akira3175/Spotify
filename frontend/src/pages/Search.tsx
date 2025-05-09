
import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from '@/components/sidebar/Sidebar';
import TopBar from '@/components/TopBar';
import MusicPlayer from '@/components/player/MusicPlayer';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import PlaylistCard from '@/components/content/PlaylistCard';
import { useNavigate } from 'react-router-dom';
import { Song } from '@/types/music';
import { Artist } from '@/types/artist';
import { Playlist } from '@/types/playlist';
import { MusicService } from '@/services/MusicService';
import { ArtistService } from '@/services/ArtistService';
import { PlaylistService } from '@/services/PlaylistService';

const SearchPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchQuery = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get("q") || "";
  }, [location.search]);
  const [tracks, setTracks] = useState<Song[]>([])
  const [artists, setArtists] = useState<Artist[]>([])
  const [playlists, setPlaylists] = useState<Playlist[]>([])

  
  // These would be fetched dynamically based on the search query in a real app
  const categories = [
    { id: 1, name: 'Pop', color: 'bg-pink-600' },
    { id: 2, name: 'Hip-Hop', color: 'bg-orange-600' },
    { id: 3, name: 'Rock', color: 'bg-red-600' },
    { id: 4, name: 'Electronic', color: 'bg-blue-600' },
    { id: 5, name: 'R&B', color: 'bg-purple-600' },
    { id: 6, name: 'Indie', color: 'bg-green-600' },
    { id: 7, name: 'Jazz', color: 'bg-yellow-600' },
    { id: 8, name: 'Classical', color: 'bg-teal-600' },
  ];

  const handleSearch = async () => {
    const songs = await MusicService.searchSongs(searchQuery)
    setTracks(songs)
    const artists = await ArtistService.searchArtist(searchQuery)
    setArtists(artists)
    const playlists = await PlaylistService.searchPlaylist(searchQuery)
    setPlaylists(playlists)
  };

  useEffect(() => {
    handleSearch()
  }, [searchQuery])

  const handleCategoryClick = (categoryId: number, categoryName: string) => {
    // In a real app, navigate to category page with the ID
    console.log(`Navigating to category ${categoryName} with ID ${categoryId}`);
    navigate(`/category/${categoryId}`);
  };

  return (
    <div className="h-screen flex flex-col bg-spotify-base">
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 flex flex-col overflow-hidden">
          <TopBar />
          <ScrollArea className="flex-1 p-6 pb-28">
            {/* <div className="relative mb-8 max-w-md">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                <SearchIcon className="h-5 w-5 text-zinc-500" />
              </div>
              <Input 
                type="text"
                placeholder="What do you want to listen to?"
                value={searchQuery}
                onChange={handleSearch}
                className="bg-zinc-800 border-none h-12 pl-10 pr-4 rounded-full text-white"
              />
            </div> */}

            {searchQuery ? (
              <div className="mt-6">
                <Tabs defaultValue="all" className="w-full">
                  <TabsList className="bg-zinc-800 border-none mb-6">
                    <TabsTrigger value="all" className="data-[state=active]:bg-zinc-700">All</TabsTrigger>
                    <TabsTrigger value="songs" className="data-[state=active]:bg-zinc-700">Songs</TabsTrigger>
                    <TabsTrigger value="artists" className="data-[state=active]:bg-zinc-700">Artists</TabsTrigger>
                    <TabsTrigger value="playlists" className="data-[state=active]:bg-zinc-700">Playlists</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="all">
                    <div className="space-y-6">
                      {/* Top result */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {artists.length > 0 && (
                        <Card className="bg-zinc-900 hover:bg-zinc-800 transition-colors p-5" onClick={() => navigate(`/artist/${artists[0].id}`)}>
                          <CardContent className="p-0">
                            <div className="flex flex-col items-start">
                              <div className="mb-4 h-36 w-36 rounded-full overflow-hidden shadow-xl">
                                <img 
                                  src={artists[0]?.artist_picture_url? artists[0].artist_picture_url : 'https://placehold.co/300x300'} 
                                  alt={artists[0]?.artist_name}
                                  className="h-full w-full object-cover" 
                                />
                              </div>
                              <h3 className="text-2xl font-bold mb-1">{artists[0]?.artist_name}</h3>
                              <span className="text-sm text-zinc-400 mb-2">Artist</span>
                              <button className="mt-4 bg-green-500 hover:bg-green-600 text-black font-bold py-2 px-4 rounded-full">
                                Play
                              </button>
                            </div>
                          </CardContent>
                        </Card>
                        )}
                        <div>
                          <h3 className="text-lg font-bold mb-4">Songs</h3>
                          <div className="space-y-2">
                            {tracks.slice(0, 4).map(track => (
                              <div key={track.id} className="flex items-center p-2 hover:bg-zinc-800 rounded-md transition-colors cursor-pointer"
                              onClick={() => navigate(`/song/${track.id}`)}>
                                <div className="h-10 w-10 mr-3">
                                  <img src={track.thumbnail} alt={track.song_name} className="h-full w-full object-cover rounded" />
                                </div>
                                <div className="flex-1">
                                  <p className="font-medium">{track.song_name}</p>
                                  <p className="text-sm text-zinc-400">{track.artist.artist_name}</p>
                                </div>
                                <span className="text-zinc-400 text-sm">{track.duration}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      {/* Artists */}
                      <div>
                        <h3 className="text-lg font-bold mb-4">Artists</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                          {artists.map(artist => (
                            <div key={artist.id} className="flex flex-col items-center text-center p-4 hover:bg-zinc-800 rounded-md transition-colors cursor-pointer"
                            onClick={() => navigate(`/artist/${artist.id}`)}>
                              <div className="h-32 w-32 mb-4 rounded-full overflow-hidden">
                                <img 
                                  src={artist.artist_picture_url? artist.artist_picture_url : 'https://placehold.co/300x300'} 
                                  alt={artist.artist_name}
                                  className="h-full w-full object-cover" 
                                />
                              </div>
                              <h4 className="font-medium mb-1">{artist.artist_name}</h4>
                              <p className="text-sm text-zinc-400">Artist</p>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Playlists */}
                      <div>
                        <h3 className="text-lg font-bold mb-4">Playlists</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                          {playlists.map(playlist => (
                            <PlaylistCard 
                              key={playlist.id}
                              image={playlist.song?.[0]?.thumbnail? playlist.song[0].thumbnail : 'https://placehold.co/300x300'}
                              title={playlist.playlist_name}
                              description={playlist.description}
                              onClick={() => navigate(`/playlist/${playlist.id}`)}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="songs">
                    <div className="space-y-2">
                      {tracks.map(track => (
                        <div key={track.id} className="flex items-center p-3 hover:bg-zinc-800 rounded-md transition-colors cursor-pointer">
                          <div className="h-12 w-12 mr-3">
                            <img src={track.thumbnail} alt={track.song_name} className="h-full w-full object-cover rounded" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{track.song_name}</p>
                            <p className="text-sm text-zinc-400">{track.artist.artist_name}</p>
                          </div>
                          <span className="text-zinc-400 text-sm">{track.duration}</span>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="artists">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                      {artists.map(artist => (
                        <div key={artist.id} className="flex flex-col items-center text-center p-4 hover:bg-zinc-800 rounded-md transition-colors cursor-pointer"
                        onClick={() => navigate(`/artist/${artist.id}`)}>
                          <div className="h-40 w-40 mb-4 rounded-full overflow-hidden">
                            <img 
                              src={artist.artist_picture_url? artist.artist_picture_url : 'https://placehold.co/300x300'} 
                              alt={artist.artist_name}
                              className="h-full w-full object-cover" 
                            />
                          </div>
                          <h4 className="font-medium mb-1">{artist.artist_name}</h4>
                          <p className="text-sm text-zinc-400">Artist</p>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="playlists">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                      {playlists.map(playlist => (
                        <PlaylistCard 
                          key={playlist.id}
                          image={playlist.song?.[0]?.thumbnail? playlist.song[0].thumbnail : 'https://placehold.co/300x300'}
                          title={playlist.playlist_name}
                          description={playlist.description}
                          onClick={() => navigate(`/playlist/${playlist.id}`)}
                        />
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold mb-6">Browse all</h2>
                
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {categories.map((category) => (
                    <div 
                      key={category.id}
                      className={`${category.color} aspect-square rounded-lg flex items-center justify-center cursor-pointer overflow-hidden relative`}
                      onClick={() => handleCategoryClick(category.id, category.name)}
                    >
                      <h3 className="text-xl font-bold text-white z-10">{category.name}</h3>
                      <div className="absolute bottom-0 right-0 w-16 h-16 transform rotate-45 translate-x-6 translate-y-6">
                        <div className="w-full h-full bg-black opacity-30 rounded-full"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </ScrollArea>
        </main>
      </div>
      <MusicPlayer />
    </div>
  );
};

export default SearchPage;
