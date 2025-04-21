
import React, { useEffect } from 'react';
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
import { Play, Music, Download, Share } from 'lucide-react';

const PurchaseHistory = () => {
  const { isAuthenticated } = useAuth();
  const { purchases, play, isPurchased } = useMusic();
  const navigate = useNavigate();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const totalSpent = purchases.reduce((sum, purchase) => sum + purchase.amount, 0).toFixed(2);

  // Sample purchase history data - will be used if no purchases in context
  const samplePurchases = [
    {
      id: 1,
      songId: 1,
      song: {
        id: 1,
        title: "Bohemian Rhapsody",
        artist: "Queen",
        artistId: 1,
        duration: "5:55",
        album: "A Night at the Opera",
        imageUrl: "https://images.unsplash.com/photo-1619961602105-16fa2a5465c2?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80",
      },
      date: new Date('2024-04-15'),
      amount: 1.99
    },
    {
      id: 2,
      songId: 2,
      song: {
        id: 2,
        title: "Stairway to Heaven",
        artist: "Led Zeppelin",
        artistId: 2,
        duration: "8:02",
        album: "Led Zeppelin IV",
        imageUrl: "https://images.unsplash.com/photo-1526142684086-7ebd69df27a5?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80",
      },
      date: new Date('2024-04-12'),
      amount: 1.49
    },
    {
      id: 3,
      songId: 3,
      song: {
        id: 3,
        title: "Imagine",
        artist: "John Lennon",
        artistId: 3,
        duration: "3:04",
        album: "Imagine",
        imageUrl: "https://images.unsplash.com/photo-1565345635904-040a70b3d002?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80",
      },
      date: new Date('2024-04-10'),
      amount: 0.99
    },
    {
      id: 4,
      songId: 4,
      song: {
        id: 4,
        title: "Billie Jean",
        artist: "Michael Jackson",
        artistId: 4,
        duration: "4:54",
        album: "Thriller",
        imageUrl: "https://images.unsplash.com/photo-1619683717556-9b22008b9ad5?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80",
      },
      date: new Date('2024-04-08'),
      amount: 1.99
    },
    {
      id: 5,
      songId: 5,
      song: {
        id: 5,
        title: "Like a Rolling Stone",
        artist: "Bob Dylan",
        artistId: 5,
        duration: "6:13",
        album: "Highway 61 Revisited",
        imageUrl: "https://images.unsplash.com/photo-1619396316238-17f37dde1a6d?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80",
      },
      date: new Date('2024-04-05'),
      amount: 1.29
    },
    {
      id: 6,
      songId: 6,
      song: {
        id: 6,
        title: "Hotel California",
        artist: "Eagles",
        artistId: 6,
        duration: "6:30",
        album: "Hotel California",
        imageUrl: "https://images.unsplash.com/photo-1619961058085-b85d70a1fce2?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80",
      },
      date: new Date('2024-04-01'),
      amount: 1.49
    }
  ];
  
  // Use either context purchases or sample data
  const displayPurchases = purchases.length > 0 ? purchases : samplePurchases;

  return (
    <Layout>
      <div className="p-6 max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Purchase History</h1>
        
        <div className="mb-6 bg-zinc-900 p-4 rounded-lg">
          <h2 className="text-lg mb-2">Summary</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-zinc-400">Total songs purchased</p>
              <p className="text-xl font-bold">{displayPurchases.length} songs</p>
            </div>
            <div>
              <p className="text-zinc-400">Total spent</p>
              <p className="text-xl font-bold">${displayPurchases.reduce((sum, p) => sum + p.amount, 0).toFixed(2)}</p>
            </div>
          </div>
        </div>

        {displayPurchases.length > 0 ? (
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
                {displayPurchases.map((purchase) => (
                  <TableRow key={purchase.id}>
                    <TableCell>
                      <div className="w-10 h-10 bg-zinc-800 rounded flex items-center justify-center overflow-hidden">
                        {purchase.song.imageUrl ? (
                          <img 
                            src={purchase.song.imageUrl} 
                            alt={purchase.song.title} 
                            className="w-full h-full object-cover" 
                          />
                        ) : (
                          <Music size={18} className="text-zinc-400" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell 
                      className="font-medium cursor-pointer hover:underline"
                      onClick={() => navigate(`/song/${purchase.songId}`)}
                    >
                      {purchase.song.title}
                    </TableCell>
                    <TableCell 
                      className="cursor-pointer hover:underline" 
                      onClick={() => navigate(`/artist/${purchase.song.artistId}`)}
                    >
                      {purchase.song.artist}
                    </TableCell>
                    <TableCell>{format(new Date(purchase.date), 'MMM d, yyyy')}</TableCell>
                    <TableCell className="text-right">${purchase.amount.toFixed(2)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button 
                          size="sm"
                          variant="ghost" 
                          className="flex items-center" 
                          onClick={() => play(purchase.song)}
                        >
                          <Play size={16} />
                        </Button>
                        <Button 
                          size="sm"
                          variant="ghost" 
                          className="flex items-center"
                        >
                          <Download size={16} />
                        </Button>
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
