import React, { useState, useEffect } from 'react';
import PlaylistGrid from './PlaylistGrid';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MusicService } from '@/services/MusicService';
import { Song } from '@/types/music';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, X } from 'lucide-react';
import { useMusic } from '@/contexts/MusicContext';

// Sample data for playlists
const recentlyPlayed = [
  { id: 1, title: 'Daily Mix 1', description: 'Kendrick Lamar, J. Cole and more', image: '/placeholder.svg' },
  { id: 2, title: 'Chill Vibes', description: 'Relaxing beats to study and focus', image: '/placeholder.svg' },
  { id: 3, title: 'Rock Classics', description: 'The greatest rock songs of all time', image: '/placeholder.svg' },
  { id: 4, title: 'Running Mix', description: 'High energy music for your workout', image: '/placeholder.svg' },
  { id: 5, title: 'Acoustic Favorites', description: 'Mellow acoustic tracks', image: '/placeholder.svg' },
  { id: 6, title: '2010s Mix', description: 'Throwback to the hits from last decade', image: '/placeholder.svg' },
];

const madeForYou = [
  { id: 1, title: 'Discover Weekly', description: 'Your weekly mixtape of fresh music', image: '/placeholder.svg' },
  { id: 2, title: 'Release Radar', description: 'Catch all the latest music from artists you follow', image: '/placeholder.svg' },
  { id: 3, title: 'Your Time Capsule', description: 'Songs from your past we think you\'ll love', image: '/placeholder.svg' },
  { id: 4, title: 'Daily Mix 2', description: 'Tyler the Creator, Kanye West and more', image: '/placeholder.svg' },
  { id: 5, title: 'Daily Mix 3', description: 'Doja Cat, SZA and more', image: '/placeholder.svg' },
];

const topCharts = [
  { id: 1, title: 'Top 50 - Global', description: 'Your daily update of the most played tracks right now', image: '/placeholder.svg' },
  { id: 2, title: 'Top Songs - USA', description: 'The hottest tracks in the United States', image: '/placeholder.svg' },
  { id: 3, title: 'Viral 50', description: 'The most viral tracks on Spotify', image: '/placeholder.svg' },
  { id: 4, title: 'Trending Now', description: 'Currently trending on social and streaming', image: '/placeholder.svg' },
];

// URL video mặc định để kiểm tra popup
const DEFAULT_VIDEO_URL = 'https://www.w3schools.com/html/mov_bbb.mp4';

const HomeContent = () => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [purchasingSong, setPurchasingSong] = useState<Song | null>(null);
  const { play, isPurchased, purchaseSong } = useMusic();
  const [teaserVideoUrl, setTeaserVideoUrl] = useState<string | null>(null);
  const [isTeaserPlaying, setIsTeaserPlaying] = useState(false);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        console.log('HomeContent: Starting to fetch songs...');
        setIsLoading(true);
        setError(null);
        
        console.log('HomeContent: Calling MusicService.getAllSongs()...');
        const fetchedSongs = await MusicService.getAllSongs();
        console.log('HomeContent: Raw API response:', fetchedSongs);
        
        if (Array.isArray(fetchedSongs)) {
          console.log('HomeContent: Received array of songs with length:', fetchedSongs.length);
          if (fetchedSongs.length === 0) {
            console.warn('HomeContent: No songs returned from API');
            setError('No songs available');
          } else {
            console.log('HomeContent: First song in array:', fetchedSongs[0]);
            console.log('HomeContent: Setting songs state with', fetchedSongs.length, 'songs');
            setSongs(fetchedSongs);
          }
        } else {
          console.warn('HomeContent: Invalid songs data received:', fetchedSongs);
          setError('Invalid songs data received');
        }
      } catch (err: any) {
        console.error('HomeContent: Error fetching songs:', {
          error: err,
          message: err.message,
          response: err.response,
          status: err.response?.status,
          data: err.response?.data
        });
        if (err.response?.status === 401) {
          setError('Please login to view songs');
        } else {
          setError('Failed to load songs');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchSongs();
  }, []);

  const fetchVideoUrl = async (songId: number | string): Promise<string | null> => {
    try {
      const response = await fetch(`/api/song/${songId}/video`);
      if (!response.ok) {
        const text = await response.text();
        console.error('fetchVideoUrl: Server response:', { status: response.status, body: text });
        return null;
      }
      const data = await response.json();
      if (!data.videoUrl) {
        console.error('fetchVideoUrl: No video URL in response:', data);
        return null;
      }
      console.log('fetchVideoUrl: Successfully fetched video URL:', data.videoUrl);
      return data.videoUrl;
    } catch (error) {
      console.error('HomeContent: Error fetching video URL:', error);
      return null;
    }
  };

  const handlePlaySong = async (song: Song) => {
    try {
      console.log('HomeContent: Checking purchase status for song:', song.title);
      const purchased = isPurchased(song.id);
      console.log('HomeContent: Purchase status:', purchased);

      if (purchased) {
        console.log('HomeContent: Playing purchased song:', song.title);
        play(song);

        // Logic phát teaser
        let videoUrl = song.videoUrl || (await fetchVideoUrl(song.id));
        if (!videoUrl) {
          console.warn('HomeContent: Using default video URL for teaser');
          videoUrl = DEFAULT_VIDEO_URL; // Sử dụng video mặc định nếu không có videoUrl
        }
        console.log('HomeContent: Teaser video URL:', videoUrl);
        setTeaserVideoUrl(videoUrl);
        setIsTeaserPlaying(true);

        // Dừng teaser sau 10 giây
        setTimeout(() => {
          setIsTeaserPlaying(false);
          setTeaserVideoUrl(null);
          console.log('HomeContent: Teaser stopped for song:', song.title);
        }, 10000);
      } else {
        console.log('HomeContent: Song not purchased, showing purchase modal:', song.title);
        setPurchasingSong(song);
      }
    } catch (error) {
      console.error('HomeContent: Error in handlePlaySong:', error);
      setError('Failed to play song');
    }
  };

  const handlePurchase = async () => {
    if (!purchasingSong) return;
    try {
      console.log('HomeContent: Initiating purchase for song:', purchasingSong.title);
      await purchaseSong(purchasingSong);
      console.log('HomeContent: Song purchased successfully:', purchasingSong.title);
      setPurchasingSong(null);
      play(purchasingSong);
    } catch (error) {
      console.error('HomeContent: Error purchasing song:', error);
      setError('Failed to purchase song');
    }
  };

  const closeTeaser = () => {
    setIsTeaserPlaying(false);
    setTeaserVideoUrl(null);
    console.log('HomeContent: Teaser closed manually');
  };

  const renderSongsGrid = () => {
    console.log('HomeContent: Rendering songs grid. Loading:', isLoading, 'Error:', error, 'Songs count:', songs.length);

    if (isLoading) {
      return (
        <div className="space-y-4">
          <Skeleton className="h-8 w-48" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {[...Array(10)].map((_, i) => (
              <Skeleton key={i} className="h-48 w-full" />
            ))}
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">All Songs</h2>
          <div className="text-red-500 p-4 border border-red-200 rounded-lg">
            {error}
            {error === 'Please login to view songs' && (
              <div className="mt-2">
                <Button variant="link" onClick={() => window.location.href = '/login'}>
                  Go to Login
                </Button>
              </div>
            )}
          </div>
        </div>
      );
    }

    if (songs.length === 0) {
      return (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">All Songs</h2>
          <div className="text-muted-foreground p-4 border rounded-lg">
            No songs available
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">All Songs</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {songs.map((song) => {
            console.log('HomeContent: Rendering song card:', song);
            return (
              <Card key={song.id} className="group relative overflow-hidden hover:bg-accent transition-colors">
                <CardHeader className="p-0">
                  <div className="relative aspect-square">
                    <img
                      src={song.imageUrl}
                      alt={song.title}
                      className="object-cover w-full h-full"
                      onError={(e) => {
                        console.log('HomeContent: Image load error for song:', song.title);
                        (e.target as HTMLImageElement).src = '/placeholder.svg';
                      }}
                    />
                    <Button
                      size="icon"
                      className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-primary hover:bg-primary/90"
                      onClick={() => handlePlaySong(song)}
                    >
                      <Play className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-2">
                  <h3 className="font-semibold truncate">{song.title}</h3>
                  <p className="text-sm text-muted-foreground truncate">{song.artist}</p>
                </CardContent>
                <CardFooter className="p-2">
                  <p className="text-sm text-muted-foreground">{song.duration}</p>
                </CardFooter>
              </Card>
            );
          })}
        </div>
        {purchasingSong && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-background p-6 rounded-lg shadow-lg max-w-sm w-full">
              <h3 className="text-lg font-semibold">Purchase Song</h3>
              <p className="mt-2">You need to purchase "{purchasingSong.title}" for $1.99 to play it.</p>
              <div className="mt-4 flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setPurchasingSong(null)}>
                  Cancel
                </Button>
                <Button onClick={handlePurchase}>Purchase</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <ScrollArea className="h-full">
      <div className="p-6 pb-28">
        {renderSongsGrid()}
        <div className="mt-8">
          <PlaylistGrid title="Recently played" playlists={recentlyPlayed} seeAllLink="#" />
          <PlaylistGrid title="Made for you" playlists={madeForYou} seeAllLink="#" />
          <PlaylistGrid title="Charts" playlists={topCharts} seeAllLink="#" />
        </div>

        {/* Teaser video ở bên phải */}
        {isTeaserPlaying && teaserVideoUrl && (
          <div className="fixed top-0 right-0 w-1/5 h-screen bg-black shadow-lg z-50 flex flex-col">
            <div className="relative flex-1">
              <video
                src={teaserVideoUrl}
                autoPlay
                muted
                loop
                className="w-full h-full object-cover"
              >
                Your browser does not support the video tag.
              </video>
              <Button
                size="icon"
                variant="ghost"
                className="absolute top-2 right-2 text-white bg-black/50 rounded-full"
                onClick={closeTeaser}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </ScrollArea>
  );
};

export default HomeContent;