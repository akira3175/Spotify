import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/sidebar/Sidebar';
import TopBar from '@/components/TopBar';
import MusicPlayer from '@/components/player/MusicPlayer';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useParams } from 'react-router-dom';
import { Play, MoreHorizontal, Calendar, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PlaylistCard from '@/components/content/PlaylistCard';
import SongPurchaseDialog from '@/components/SongPurchaseDialog';
import { Artist } from '@/types/artist';
import { Song } from '@/types/music';
import { ArtistService } from '@/services/ArtistService';
import { useMusic } from '@/contexts/MusicContext';

// Expanded albums data
const artistAlbums = {
  1: [ // Taylor Swift
    { id: 101, title: "Midnights", description: "Released in 2022", image: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80" },
    { id: 102, title: "Folklore", description: "Released in 2020", image: "https://images.unsplash.com/photo-1616356607338-fd87169ecf1a?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80" },
    { id: 103, title: "Lover", description: "Released in 2019", image: "https://images.unsplash.com/photo-1621252179027-94459d278660?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80" },
    { id: 104, title: "1989", description: "Released in 2014", image: "https://images.unsplash.com/photo-1618004652321-13a63e576b80?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80" },
    { id: 105, title: "Red", description: "Released in 2012", image: "https://images.unsplash.com/photo-1517230878791-4d28214057c2?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80" }
  ],
  2: [ // Drake
    { id: 201, title: "Certified Lover Boy", description: "Released in 2021", image: "https://images.unsplash.com/photo-1504450874802-0ba2bcd9b5ae?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80" },
    { id: 202, title: "Scorpion", description: "Released in 2018", image: "https://images.unsplash.com/photo-1512036666432-2181c1f26420?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80" },
    { id: 203, title: "Views", description: "Released in 2016", image: "https://images.unsplash.com/photo-1605722625766-a4c989c747a4?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80" },
    { id: 204, title: "Nothing Was the Same", description: "Released in 2013", image: "https://images.unsplash.com/photo-1553267751-1c148a7280a1?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80" }
  ]
};

// Similar artists data
const similarArtists = {
  1: [ // Similar to Taylor Swift
    { id: 3, name: "Katy Perry", description: "Artist", image: "https://images.unsplash.com/photo-1535324492437-d8dea70a38a7?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80" },
    { id: 4, name: "Ariana Grande", description: "Artist", image: "https://images.unsplash.com/photo-1515202913167-44c9eda7c6e8?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80" },
    { id: 5, name: "Selena Gomez", description: "Artist", image: "https://images.unsplash.com/photo-1541348263662-e068662d82af?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80" },
    { id: 6, name: "Lady Gaga", description: "Artist", image: "https://images.unsplash.com/photo-1517230878791-4d28214057c2?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80" }
  ],
  2: [ // Similar to Drake
    { id: 7, name: "Kendrick Lamar", description: "Artist", image: "https://images.unsplash.com/photo-1621609764095-b32bbe35cf3a?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80" },
    { id: 8, name: "J. Cole", description: "Artist", image: "https://images.unsplash.com/photo-1567784177951-6fa58317e16b?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80" },
    { id: 9, name: "Travis Scott", description: "Artist", image: "https://images.unsplash.com/photo-1608312149553-d379eb7cd99d?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80" },
    { id: 10, name: "Post Malone", description: "Artist", image: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80" }
  ]
};

const ArtistPage = () => {
  const { id } = useParams<{ id: string }>();
  const artistId = parseInt(id || '0');
  const [artist, setArtist] = useState<Artist | null>(null);
  const [tracks, setTracks] = useState<Song[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const { play } = useMusic();

  useEffect(() => {
    const fetchArtist = async () => {
      const artist = await ArtistService.getArtistById(artistId);
      setArtist(artist);
      setTracks(artist?.songs || []);
    };
    fetchArtist();
  }, [artistId]);

  useEffect(() => {
    const checkFollowStatus = async () => {
      try {
        const isFollowing = await ArtistService.isFollowingArtist(artistId);
        setIsFollowing(isFollowing);
      } catch (error) {
        console.error('Error checking follow status:', error);
      }
    };
    checkFollowStatus();
  }, [artistId]);

  const handlePlay = () => {
    play(tracks[0]);
  };

  const handleFollow = async () => {
    try {
      if (isFollowing) {
        await ArtistService.unfollowArtist(artistId);
      } else {
        await ArtistService.followArtist(artistId);
      }
      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error('Error following/unfollowing artist:', error);
    }
  };

  // Get albums, tracks, and similar artists for this artist
  const albums = artistAlbums[artistId as keyof typeof artistAlbums] || artistAlbums[1];
  const popularTracks = tracks[artistId as keyof typeof tracks] || tracks[1];
  const relatedArtists = similarArtists[artistId as keyof typeof similarArtists] || similarArtists[1];

  return (
    <div className="h-screen flex flex-col bg-spotify-base">
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 flex flex-col overflow-hidden">
          <TopBar />
          <ScrollArea className="flex-1 pb-28">
            {/* Artist header */}
            <div 
              className="relative h-80 bg-cover bg-center" 
              style={{ 
                backgroundImage: artist?.artist_picture_url ? `url(${artist?.artist_picture_url})` : 'none',
                backgroundSize: 'cover'
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-spotify-base"></div>
              <div className="absolute bottom-0 left-0 p-8 flex items-end">
                <div className="mr-6">
                  <img 
                    src={artist?.artist_picture_url} 
                    alt={artist?.artist_name}
                    className="w-40 h-40 rounded-full shadow-xl border-4 border-spotify-base" 
                  />
                </div>
                <div>
                  <span className="uppercase text-xs font-bold text-white">Artist</span>
                  <h1 className="text-6xl font-bold my-3 text-white">{artist?.artist_name}</h1>
                </div>
              </div>
            </div>
            
            <div className="px-8 py-6">
              <div className="flex items-center gap-4 mb-8">
                <Button className="rounded-full w-14 h-14 flex items-center justify-center bg-spotify-bright-accent hover:scale-105 hover:bg-spotify-bright-accent transition-transform" onClick={handlePlay}>
                  <Play size={24} fill="black" className="text-black ml-1" />
                </Button>
                <Button variant="outline" className="rounded-full border-gray-400 text-white" onClick={handleFollow}>
                  {isFollowing ? 'Following' : 'Follow'}
                </Button>
                <Button variant="ghost" className="rounded-full text-white">
                  <MoreHorizontal size={24} />
                </Button>
              </div>
              
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="bg-transparent mb-6">
                  <TabsTrigger value="overview" className="text-white data-[state=active]:bg-zinc-800">Overview</TabsTrigger>
                  <TabsTrigger value="songs" className="text-white data-[state=active]:bg-zinc-800">Songs</TabsTrigger>
                  <TabsTrigger value="albums" className="text-white data-[state=active]:bg-zinc-800">Albums</TabsTrigger>
                  <TabsTrigger value="about" className="text-white data-[state=active]:bg-zinc-800">About</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview">
                  <div className="space-y-8">
                    <div>
                      <h2 className="text-2xl font-bold mb-4 text-white">Popular</h2>
                      <Table>
                        <TableHeader>
                          <TableRow className="border-b border-zinc-700 hover:bg-transparent">
                            <TableHead className="w-12">#</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead className="text-right">
                              <Calendar size={16} />
                            </TableHead>
                            <TableHead className="text-right">
                              <Music size={16} />
                            </TableHead>
                            <TableHead className="text-right">Buy</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {tracks.slice(0, 5).map((track, index) => (
                            <TableRow key={track.id} className="border-none hover:bg-zinc-800" onClick={() => play(track)}>
                              <TableCell>{index + 1}</TableCell>
                              <TableCell>{track.song_name}</TableCell>
                              <TableCell className="text-zinc-400 text-right">{new Date(track.release_date).toLocaleDateString()}</TableCell>
                              <TableCell className="text-zinc-400 text-right">{track.duration}</TableCell>
                              <TableCell className="text-right">
                                <SongPurchaseDialog 
                                  song={track as unknown as Song} 
                                  artist={artist} 
                                  price={track.price} 
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                    
                    <div>
                      <h2 className="text-2xl font-bold mb-4 text-white">Albums</h2>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {albums.slice(0, 5).map(album => (
                          <PlaylistCard 
                            key={album.id}
                            image={album.image}
                            title={album.title}
                            description={album.description}
                          />
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h2 className="text-2xl font-bold mb-4 text-white">Fans also like</h2>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {relatedArtists.map(artist => (
                          <PlaylistCard 
                            key={artist.id}
                            image={artist.image}
                            title={artist.name}
                            description={artist.description}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="songs">
                  <div>
                    <h2 className="text-2xl font-bold mb-4 text-white">Popular Songs</h2>
                    <Table>
                      <TableHeader>
                        <TableRow className="border-b border-zinc-700 hover:bg-transparent">
                          <TableHead className="w-12">#</TableHead>
                          <TableHead>Title</TableHead>
                          <TableHead className="text-right">Duration</TableHead>
                          <TableHead className="text-right">Buy</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {tracks.map((track, index) => (
                          <TableRow key={track.id} className="border-none hover:bg-zinc-800">
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{track.song_name}</TableCell>
                            <TableCell className="text-zinc-400 text-right">{track.duration}</TableCell>
                            <TableCell className="text-right">
                              <SongPurchaseDialog 
                                song={track as unknown as Song} 
                                artist={artist} 
                                price={track.price} 
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
                
                <TabsContent value="albums">
                  <div>
                    <h2 className="text-2xl font-bold mb-4 text-white">Albums</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                      {albums.map(album => (
                        <PlaylistCard 
                          key={album.id}
                          image={album.image}
                          title={album.title}
                          description={album.description}
                        />
                      ))}
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="about">
                  <div className="max-w-3xl">
                    <h2 className="text-2xl font-bold mb-4 text-white">About</h2>
                    <div className="mb-8">
                      <img 
                        src={artist?.artist_picture_url} 
                        alt={artist?.artist_name}
                        className="w-40 h-40 float-left mr-6 mb-4 rounded-md" 
                      />
                      <p className="text-white mb-4">{artist?.artist_bio}</p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </ScrollArea>
        </main>
      </div>
      <MusicPlayer />
    </div>
  );
};

export default ArtistPage;
