
import React, { useState } from 'react';
import Sidebar from '@/components/sidebar/Sidebar';
import TopBar from '@/components/TopBar';
import MusicPlayer from '@/components/player/MusicPlayer';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Search as SearchIcon, Disc, User } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import PlaylistCard from '@/components/content/PlaylistCard';
import { useNavigate } from 'react-router-dom';

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  
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

  // Mock search results - would come from an API in a real app
  const searchResults = {
    tracks: [
      { id: 1, title: "Shape of You", artist: "Ed Sheeran", album: "÷", duration: "3:54", image: "https://placehold.co/300x300?text=Shape+of+You" },
      { id: 2, title: "Blinding Lights", artist: "The Weeknd", album: "After Hours", duration: "3:22", image: "https://placehold.co/300x300?text=Blinding+Lights" },
      { id: 3, title: "Bad Guy", artist: "Billie Eilish", album: "When We All Fall Asleep", duration: "3:14", image: "https://placehold.co/300x300?text=Bad+Guy" },
      { id: 4, title: "Levitating", artist: "Dua Lipa", album: "Future Nostalgia", duration: "3:23", image: "https://placehold.co/300x300?text=Levitating" },
    ],
    artists: [
      { id: 1, name: "Taylor Swift", followers: "50.2M", image: "https://placehold.co/300x300?text=Taylor+Swift" },
      { id: 2, name: "Drake", followers: "48.3M", image: "https://placehold.co/300x300?text=Drake" },
      { id: 3, name: "Beyoncé", followers: "45.1M", image: "https://placehold.co/300x300?text=Beyonce" },
    ],
    playlists: [
      { id: 1, title: "Today's Top Hits", description: "Ed Sheeran is on top of the Hottest 50!", image: "https://placehold.co/300x300?text=Top+Hits" },
      { id: 2, title: "RapCaviar", description: "New music from Drake, Lil Baby and more", image: "https://placehold.co/300x300?text=RapCaviar" },
      { id: 3, title: "Chill Hits", description: "Kick back to the best new and recent chill hits", image: "https://placehold.co/300x300?text=Chill+Hits" },
    ],
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    // In a real app, this would trigger a search request
    console.log("Searching for:", e.target.value);
  };

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
            <div className="relative mb-8 max-w-md">
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
            </div>

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
                        <Card className="bg-zinc-900 hover:bg-zinc-800 transition-colors p-5">
                          <CardContent className="p-0">
                            <div className="flex flex-col items-start">
                              <div className="mb-4 h-36 w-36 rounded-full overflow-hidden shadow-xl">
                                <img 
                                  src={searchResults.artists[0].image} 
                                  alt={searchResults.artists[0].name}
                                  className="h-full w-full object-cover" 
                                />
                              </div>
                              <h3 className="text-2xl font-bold mb-1">{searchResults.artists[0].name}</h3>
                              <span className="text-sm text-zinc-400 mb-2">Artist</span>
                              <button className="mt-4 bg-green-500 hover:bg-green-600 text-black font-bold py-2 px-4 rounded-full">
                                Play
                              </button>
                            </div>
                          </CardContent>
                        </Card>
                        
                        <div>
                          <h3 className="text-lg font-bold mb-4">Songs</h3>
                          <div className="space-y-2">
                            {searchResults.tracks.slice(0, 4).map(track => (
                              <div key={track.id} className="flex items-center p-2 hover:bg-zinc-800 rounded-md transition-colors cursor-pointer">
                                <div className="h-10 w-10 mr-3">
                                  <img src={track.image} alt={track.title} className="h-full w-full object-cover rounded" />
                                </div>
                                <div className="flex-1">
                                  <p className="font-medium">{track.title}</p>
                                  <p className="text-sm text-zinc-400">{track.artist}</p>
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
                          {searchResults.artists.map(artist => (
                            <div key={artist.id} className="flex flex-col items-center text-center p-4 hover:bg-zinc-800 rounded-md transition-colors cursor-pointer">
                              <div className="h-32 w-32 mb-4 rounded-full overflow-hidden">
                                <img 
                                  src={artist.image} 
                                  alt={artist.name}
                                  className="h-full w-full object-cover" 
                                />
                              </div>
                              <h4 className="font-medium mb-1">{artist.name}</h4>
                              <p className="text-sm text-zinc-400">Artist</p>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Playlists */}
                      <div>
                        <h3 className="text-lg font-bold mb-4">Playlists</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                          {searchResults.playlists.map(playlist => (
                            <PlaylistCard 
                              key={playlist.id}
                              image={playlist.image}
                              title={playlist.title}
                              description={playlist.description}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="songs">
                    <div className="space-y-2">
                      {searchResults.tracks.map(track => (
                        <div key={track.id} className="flex items-center p-3 hover:bg-zinc-800 rounded-md transition-colors cursor-pointer">
                          <div className="h-12 w-12 mr-3">
                            <img src={track.image} alt={track.title} className="h-full w-full object-cover rounded" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{track.title}</p>
                            <p className="text-sm text-zinc-400">{track.artist} • {track.album}</p>
                          </div>
                          <span className="text-zinc-400 text-sm">{track.duration}</span>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="artists">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                      {searchResults.artists.map(artist => (
                        <div key={artist.id} className="flex flex-col items-center text-center p-4 hover:bg-zinc-800 rounded-md transition-colors cursor-pointer">
                          <div className="h-40 w-40 mb-4 rounded-full overflow-hidden">
                            <img 
                              src={artist.image} 
                              alt={artist.name}
                              className="h-full w-full object-cover" 
                            />
                          </div>
                          <h4 className="font-medium mb-1">{artist.name}</h4>
                          <p className="text-sm text-zinc-400">Artist • {artist.followers}</p>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="playlists">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                      {searchResults.playlists.map(playlist => (
                        <PlaylistCard 
                          key={playlist.id}
                          image={playlist.image}
                          title={playlist.title}
                          description={playlist.description}
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
