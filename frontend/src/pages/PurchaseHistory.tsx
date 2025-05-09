import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useMusic } from '@/contexts/MusicContext';
import Layout from '@/components/Layout';
import { format } from 'date-fns';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Play, Music, Download, Share } from 'lucide-react';
import { Song } from '@/types/music';
import { Order } from '@/types/purchase';

const PurchaseHistory = () => {
  const { isAuthenticated } = useAuth();
  const [purchases, setPurchases] = useState<Order[]>([]);
  const { play, downloadSong, getPurchases } = useMusic();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
    const fetchPurchases = async () => {
      const purchases = await getPurchases();
      setPurchases(purchases);
    };
    fetchPurchases();
  }, [isAuthenticated, navigate]);

  const fetchAudioUrl = async (songId: string | number): Promise<string> => {
    try {
      const response = await fetch(`/api/song/${songId}/audio`);
      if (!response.ok) throw new Error('Failed to fetch audio');
      const data = await response.json();
      return data.audioUrl;
    } catch (error) {
      console.error('PurchaseHistory: Error fetching audio URL:', error);
      throw error;
    }
  };

  const handlePlay = async (song: Song) => {
    try {
      const audioUrl = song.audio || (await fetchAudioUrl(song.id));
      play({ ...song, audio: audioUrl });
    } catch (error) {
      console.error('PurchaseHistory: Error playing song:', error);
    }
  };

  const handleDownload = (song: Song, format: 'mp3' | 'mp4' | 'both') => {
    downloadSong(song, format);
  };

  return (
    <Layout>
      <div className="p-6 max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Purchase History</h1>
        
        <div className="mb-6 bg-zinc-900 p-4 rounded-lg">
          <h2 className="text-lg mb-2">Summary</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-zinc-400">Total songs purchased</p>
              <p className="text-xl font-bold">{purchases.length} songs</p>
            </div>
            <div>
              <p className="text-zinc-400">Total spent</p>
              <p className="text-xl font-bold">${purchases.reduce((sum, p) => sum + Number(p.song.price), 0).toFixed(2)}</p>
            </div>
          </div>
        </div>

        {purchases.length > 0 ? (
          <div className="bg-zinc-900 rounded-lg overflow-hidden">
            <Table>
              <TableCaption>Your purchase history</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12"></TableHead>
                  <TableHead>Song</TableHead>
                  <TableHead>Artist</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="w-32">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {purchases.map((purchase) => (
                  <TableRow key={purchase.id}>
                    <TableCell>
                      <div className="w-10 h-10 bg-zinc-800 rounded flex items-center justify-center overflow-hidden">
                        {purchase.song.thumbnail ? (
                          <img 
                            src={purchase.song.thumbnail} 
                            alt={purchase.song.song_name} 
                            className="w-full h-full object-cover" 
                          />
                        ) : (
                          <Music size={18} className="text-zinc-400" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell 
                      className="font-medium cursor-pointer hover:underline"
                      onClick={() => navigate(`/song/${purchase.song.id}`)}
                    >
                      {purchase.song.song_name}
                    </TableCell>
                    <TableCell 
                      className="cursor-pointer hover:underline" 
                      onClick={() => navigate(`/artist/${purchase.song.artist.id}`)}
                    >
                      {purchase.song.artist.artist_name}
                    </TableCell>
                    <TableCell>{format(new Date(purchase.date_buy), 'MMM d, yyyy')}</TableCell>
                    <TableCell className="text-right">${Number(purchase.song.price).toFixed(2)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button 
                          size="sm"
                          variant="ghost" 
                          className="flex items-center" 
                          onClick={() => handlePlay(purchase.song as Song)}
                        >
                          <Play size={16} />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button 
                              size="sm"
                              variant="ghost" 
                              className="flex items-center"
                            >
                              <Download size={16} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => handleDownload(purchase.song as Song, 'mp3')}>
                              Download MP3
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDownload(purchase.song as Song, 'mp4')}>
                              Download MP4
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDownload(purchase.song as Song, 'both')}>
                              Download Both
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                        <Button 
                          size="sm"
                          variant="ghost" 
                          className="flex items-center"
                        >
                          <Share size={16} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="bg-zinc-900 rounded-lg p-12 text-center">
            <Music size={48} className="mx-auto text-zinc-500 mb-4" />
            <h3 className="text-xl font-bold mb-2">No purchases yet</h3>
            <p className="text-zinc-400 mb-6">You haven't purchased any songs yet.</p>
            <Button onClick={() => navigate('/search')}>
              Browse Music
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default PurchaseHistory;