
import React from 'react';
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

// Enhanced artist data with more details
const artists = [
  { 
    id: 1, 
    name: "Taylor Swift", 
    image: "https://images.unsplash.com/photo-1545128485-c400ce7b23d2?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80",
    headerImage: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&h=300&q=80",
    monthlyListeners: "82,354,169",
    bio: "Taylor Swift is an American singer-songwriter. Her discography spans multiple genres, and her songwriting—often inspired by her personal life—has received critical praise and wide media coverage. Born in West Reading, Pennsylvania, Swift moved to Nashville at age 14 to become a country artist.",
    founded: "2006",
    location: "Nashville, Tennessee",
    website: "taylorswift.com",
    socialMedia: {
      instagram: "@taylorswift",
      twitter: "@taylorswift13",
      facebook: "TaylorSwift"
    }
  },
  { 
    id: 2, 
    name: "Drake", 
    image: "https://images.unsplash.com/photo-1541516160071-4bb0c5af65ba?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80",
    headerImage: "https://images.unsplash.com/photo-1514533212735-5397576230d1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&h=300&q=80",
    monthlyListeners: "67,892,345",
    bio: "Drake is a Canadian rapper, singer, and actor. An influential figure in modern popular music, Drake has been credited for popularizing singing and R&B sensibilities in hip hop. He first gained recognition starring in the teen drama Degrassi before pursuing music.",
    founded: "2006",
    location: "Toronto, Canada",
    website: "drakeofficial.com",
    socialMedia: {
      instagram: "@champagnepapi",
      twitter: "@Drake",
      facebook: "Drake"
    }
  },
  { 
    id: 3, 
    name: "The Beatles", 
    image: "https://images.unsplash.com/photo-1598387181032-a3103a2db5b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80",
    headerImage: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&h=300&q=80",
    monthlyListeners: "23,487,512",
    bio: "The Beatles were an English rock band formed in Liverpool in 1960, comprising John Lennon, Paul McCartney, George Harrison and Ringo Starr. They are regarded as the most influential band of all time and were integral to the development of 1960s counterculture and popular music's recognition as an art form.",
    founded: "1960",
    location: "Liverpool, England",
    website: "thebeatles.com",
    socialMedia: {
      instagram: "@thebeatles",
      twitter: "@thebeatles",
      facebook: "TheBeatles"
    }
  },
  { 
    id: 4, 
    name: "Beyoncé", 
    image: "https://images.unsplash.com/photo-1593104547489-5cfb3839a3b5?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80",
    headerImage: "https://images.unsplash.com/photo-1504509546545-e000b4a62425?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&h=300&q=80",
    monthlyListeners: "45,632,879",
    bio: "Beyoncé Giselle Knowles-Carter is an American singer, songwriter, and actress. Beyoncé has been noted for her boundary-pushing artistry and her vocal abilities. Her success has made her a cultural icon and earned her the nickname 'Queen Bey'.",
    founded: "1997",
    location: "Houston, Texas",
    website: "beyonce.com",
    socialMedia: {
      instagram: "@beyonce",
      twitter: "@beyonce",
      facebook: "beyonce"
    }
  },
  { 
    id: 5, 
    name: "Ed Sheeran", 
    image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80",
    headerImage: "https://images.unsplash.com/photo-1471478331149-c72f17e33c73?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&h=300&q=80",
    monthlyListeners: "78,214,358",
    bio: "Edward Christopher Sheeran is an English singer-songwriter. Born in Halifax, West Yorkshire and raised in Framlingham, Suffolk, he began writing songs around the age of eleven. Sheeran's music incorporates elements of pop, folk, and R&B.",
    founded: "2004",
    location: "Suffolk, England",
    website: "edsheeran.com",
    socialMedia: {
      instagram: "@teddysphotos",
      twitter: "@edsheeran",
      facebook: "EdSheeranMusic"
    }
  }
];

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

// Expanded tracks data
const artistTracks = {
  1: [ // Taylor Swift
    { id: 1001, title: "Anti-Hero", album: "Midnights", releaseDate: "2022", duration: "3:20", plays: "1.2B", price: 1.29 },
    { id: 1002, title: "Cruel Summer", album: "Lover", releaseDate: "2019", duration: "2:58", plays: "950M", price: 1.29 },
    { id: 1003, title: "Love Story", album: "Fearless", releaseDate: "2008", duration: "3:55", plays: "1.5B", price: 0.99 },
    { id: 1004, title: "Blank Space", album: "1989", releaseDate: "2014", duration: "3:51", plays: "1.4B", price: 1.29 },
    { id: 1005, title: "Shake It Off", album: "1989", releaseDate: "2014", duration: "3:39", plays: "1.6B", price: 0.99 },
    { id: 1006, title: "Cardigan", album: "Folklore", releaseDate: "2020", duration: "3:59", plays: "780M", price: 1.29 },
    { id: 1007, title: "All Too Well", album: "Red", releaseDate: "2012", duration: "5:29", plays: "650M", price: 1.29 },
    { id: 1008, title: "You Belong With Me", album: "Fearless", releaseDate: "2008", duration: "3:52", plays: "1.1B", price: 0.99 }
  ],
  2: [ // Drake
    { id: 2001, title: "God's Plan", album: "Scorpion", releaseDate: "2018", duration: "3:18", plays: "1.9B", price: 1.29 },
    { id: 2002, title: "Hotline Bling", album: "Views", releaseDate: "2016", duration: "4:27", plays: "1.7B", price: 1.29 },
    { id: 2003, title: "One Dance", album: "Views", releaseDate: "2016", duration: "2:54", plays: "2.1B", price: 1.29 },
    { id: 2004, title: "Started From the Bottom", album: "Nothing Was the Same", releaseDate: "2013", duration: "2:54", plays: "890M", price: 0.99 },
    { id: 2005, title: "In My Feelings", album: "Scorpion", releaseDate: "2018", duration: "3:37", plays: "1.5B", price: 1.29 }
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
  
  // Find artist from sample data, fallback to first artist if not found
  const artist = artists.find(a => a.id === artistId) || artists[0];
  
  // Get albums, tracks, and similar artists for this artist
  const albums = artistAlbums[artistId as keyof typeof artistAlbums] || artistAlbums[1];
  const popularTracks = artistTracks[artistId as keyof typeof artistTracks] || artistTracks[1];
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
                backgroundImage: `url(${artist.headerImage})`,
                backgroundSize: 'cover'
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-spotify-base"></div>
              <div className="absolute bottom-0 left-0 p-8 flex items-end">
                <div className="mr-6">
                  <img 
                    src={artist.image} 
                    alt={artist.name}
                    className="w-40 h-40 rounded-full shadow-xl border-4 border-spotify-base" 
                  />
                </div>
                <div>
                  <span className="uppercase text-xs font-bold text-white">Artist</span>
                  <h1 className="text-6xl font-bold my-3 text-white">{artist.name}</h1>
                  <p className="text-white text-sm">{artist.monthlyListeners} monthly listeners</p>
                </div>
              </div>
            </div>
            
            <div className="px-8 py-6">
              <div className="flex items-center gap-4 mb-8">
                <Button className="rounded-full w-14 h-14 flex items-center justify-center bg-spotify-bright-accent hover:scale-105 hover:bg-spotify-bright-accent transition-transform">
                  <Play size={24} fill="black" className="text-black ml-1" />
                </Button>
                <Button variant="outline" className="rounded-full border-gray-400 text-white">
                  Follow
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
                            <TableHead>Album</TableHead>
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
                          {popularTracks.slice(0, 5).map((track, index) => (
                            <TableRow key={track.id} className="border-none hover:bg-zinc-800">
                              <TableCell>{index + 1}</TableCell>
                              <TableCell>{track.title}</TableCell>
                              <TableCell className="text-zinc-400">{track.album}</TableCell>
                              <TableCell className="text-zinc-400 text-right">{track.releaseDate}</TableCell>
                              <TableCell className="text-zinc-400 text-right">{track.plays}</TableCell>
                              <TableCell className="text-right">
                                <SongPurchaseDialog 
                                  song={track.title} 
                                  artist={artist.name} 
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
                          <TableHead>Album</TableHead>
                          <TableHead className="text-right">Duration</TableHead>
                          <TableHead className="text-right">Buy</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {popularTracks.map((track, index) => (
                          <TableRow key={track.id} className="border-none hover:bg-zinc-800">
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{track.title}</TableCell>
                            <TableCell className="text-zinc-400">{track.album}</TableCell>
                            <TableCell className="text-zinc-400 text-right">{track.duration}</TableCell>
                            <TableCell className="text-right">
                              <SongPurchaseDialog 
                                song={track.title} 
                                artist={artist.name} 
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
                        src={artist.image} 
                        alt={artist.name}
                        className="w-40 h-40 float-left mr-6 mb-4 rounded-md" 
                      />
                      <p className="text-white mb-4">{artist.bio}</p>
                      <p className="text-white mb-6">
                        {artist.monthlyListeners} monthly listeners
                      </p>
                      
                      <div className="clear-both grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 text-white">
                        <div>
                          <h3 className="font-bold mb-2">Info</h3>
                          <dl className="space-y-2">
                            <div className="flex">
                              <dt className="w-24 text-zinc-400">Since:</dt>
                              <dd>{artist.founded}</dd>
                            </div>
                            <div className="flex">
                              <dt className="w-24 text-zinc-400">Origin:</dt>
                              <dd>{artist.location}</dd>
                            </div>
                            <div className="flex">
                              <dt className="w-24 text-zinc-400">Website:</dt>
                              <dd className="text-green-400">{artist.website}</dd>
                            </div>
                          </dl>
                        </div>
                        
                        <div>
                          <h3 className="font-bold mb-2">Social Media</h3>
                          <dl className="space-y-2">
                            <div className="flex">
                              <dt className="w-24 text-zinc-400">Instagram:</dt>
                              <dd>{artist.socialMedia?.instagram}</dd>
                            </div>
                            <div className="flex">
                              <dt className="w-24 text-zinc-400">Twitter:</dt>
                              <dd>{artist.socialMedia?.twitter}</dd>
                            </div>
                            <div className="flex">
                              <dt className="w-24 text-zinc-400">Facebook:</dt>
                              <dd>{artist.socialMedia?.facebook}</dd>
                            </div>
                          </dl>
                        </div>
                      </div>
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
