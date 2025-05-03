
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useMusic } from '@/contexts/MusicContext';
import { Button } from '@/components/ui/button';
import { Play, Share, Heart, Clock, Music, Album, User } from 'lucide-react';
import SongPurchaseDialog from '@/components/SongPurchaseDialog';

const SongDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isPurchased, play, purchaseSong } = useMusic();
  
  // Mock data - in a real app this would come from an API call
  const song = {
    id: parseInt(id || "1"),
    title: "Bohemian Rhapsody",
    artist: "Queen",
    artistId: 1,
    duration: "5:55",
    album: "A Night at the Opera",
    releaseDate: "October 31, 1975",
    genre: "Rock",
    imageUrl: "/placeholder.svg",
    price: 1.99,
    lyrics: "Is this the real life? Is this just fantasy?\nCaught in a landslide, no escape from reality\nOpen your eyes, look up to the skies and see\nI'm just a poor boy, I need no sympathy\nBecause I'm easy come, easy go, little high, little low\nAny way the wind blows doesn't really matter to me, to me\n\nMama, just killed a man\nPut a gun against his head, pulled my trigger, now he's dead\nMama, life had just begun\nBut now I've gone and thrown it all away",
    description: "Bohemian Rhapsody is a song by the British rock band Queen. It was written by Freddie Mercury for the band's 1975 album A Night at the Opera. The song is a six-minute suite, notable for its lack of a refraining chorus and consisting of several sections: an intro, a ballad segment, an operatic passage, a hard rock part and a reflective coda.",
  };
  
  const purchased = isPurchased(song.id);
  
  const handlePlay = () => {
    play({
      id: song.id,
      title: song.title,
      artist: song.artist,
      artistId: song.artistId,
      duration: song.duration,
      album: song.album,
      audioUrl: song.audioUrl,
      imageUrl: song.imageUrl,
      price: song.price,
    });
  };
  
  const handlePurchase = () => {
    purchaseSong({
      id: song.id,
      title: song.title,
      artist: song.artist,
      artistId: song.artistId,
      duration: song.duration,
      album: song.album,
      imageUrl: song.imageUrl,
      price: song.price,
    });
  };

  return (
    <Layout>
      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start mb-8">
          <div className="w-64 h-64 bg-zinc-800 rounded-lg flex-shrink-0 shadow-lg flex items-center justify-center">
            {song.imageUrl ? (
              <img 
                src={song.imageUrl} 
                alt={song.title} 
                className="w-full h-full object-cover rounded-lg" 
              />
            ) : (
              <Music size={64} className="text-zinc-600" />
            )}
          </div>
          
          <div className="flex-1">
            <div className="mb-4">
              <span className="text-sm text-zinc-400">SONG</span>
              <h1 className="text-4xl font-bold mb-2">{song.title}</h1>
              <div className="flex items-center">
                <span 
                  className="text-zinc-300 hover:text-white hover:underline cursor-pointer"
                  onClick={() => navigate(`/artist/${song.artistId}`)}
                >
                  {song.artist}
                </span>
                <span className="mx-2 text-zinc-500">•</span>
                <span className="text-zinc-400">{song.album}</span>
                <span className="mx-2 text-zinc-500">•</span>
                <span className="text-zinc-400">{song.releaseDate}</span>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-3 mb-6">
              {purchased ? (
                <Button className="bg-green-500 hover:bg-green-600 text-black font-bold" onClick={handlePlay}>
                  <Play className="mr-1" size={16} />
                  Play
                </Button>
              ) : (
                <SongPurchaseDialog 
                  song={song.title} 
                  artist={song.artist} 
                  price={song.price} 
                  onPurchase={handlePurchase} 
                />
              )}
              
              <Button variant="outline" size="icon">
                <Heart />
              </Button>
              
              <Button variant="outline" size="icon">
                <Share />
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
              <div className="flex items-center">
                <Clock className="mr-2 text-zinc-400" size={16} />
                <span className="text-sm text-zinc-400">Duration: </span>
                <span className="ml-1">{song.duration}</span>
              </div>
              <div className="flex items-center">
                <Album className="mr-2 text-zinc-400" size={16} />
                <span className="text-sm text-zinc-400">Album: </span>
                <span className="ml-1">{song.album}</span>
              </div>
              <div className="flex items-center">
                <Music className="mr-2 text-zinc-400" size={16} />
                <span className="text-sm text-zinc-400">Genre: </span>
                <span className="ml-1">{song.genre}</span>
              </div>
              <div className="flex items-center">
                <User className="mr-2 text-zinc-400" size={16} />
                <span className="text-sm text-zinc-400">Artist: </span>
                <span 
                  className="ml-1 hover:underline cursor-pointer"
                  onClick={() => navigate(`/artist/${song.artistId}`)}
                >
                  {song.artist}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-zinc-900 p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">About the Song</h2>
            <p className="text-zinc-300">{song.description}</p>
          </div>
          
          <div className="bg-zinc-900 p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Lyrics</h2>
            {purchased ? (
              <pre className="text-zinc-300 whitespace-pre-line font-sans">{song.lyrics}</pre>
            ) : (
              <div className="text-center p-8">
                <Music className="mx-auto mb-3 text-zinc-500" size={32} />
                <p className="mb-4 text-zinc-400">Purchase this song to view lyrics</p>
                <SongPurchaseDialog 
                  song={song.title} 
                  artist={song.artist} 
                  price={song.price} 
                  onPurchase={handlePurchase} 
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SongDetails;
