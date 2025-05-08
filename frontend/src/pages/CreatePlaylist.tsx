
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useMusic } from '@/contexts/MusicContext';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Music } from 'lucide-react';
 
const playlistSchema = z.object({
  name: z.string().min(1, "Playlist name is required").max(50, "Playlist name must be 50 characters or less"),
});

type PlaylistFormValues = z.infer<typeof playlistSchema>;

const CreatePlaylist = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { createPlaylist } = useMusic();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const form = useForm<PlaylistFormValues>({
    resolver: zodResolver(playlistSchema),
    defaultValues: {
      name: '',
    },
  });

  const onSubmit = (data: PlaylistFormValues) => {
    createPlaylist(data.name);
    navigate('/');
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Create Playlist</h1>
        
        <div className="bg-zinc-900 p-6 rounded-lg">
          <div className="mb-6 flex gap-4 items-center">
            <div className="w-32 h-32 bg-zinc-800 rounded-md flex items-center justify-center">
              <Music size={48} className="text-zinc-600" />
            </div>
            <div>
              <p className="text-zinc-400 mb-2">Start creating your custom playlist</p>
              <h2 className="text-xl font-bold">New Playlist</h2>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Playlist Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter a name for your playlist" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex gap-4">
                <Button type="submit" className="bg-green-500 hover:bg-green-600 text-black">
                  Create Playlist
                </Button>
                <Button type="button" variant="outline" onClick={() => navigate('/')}>
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </Layout>
  );
};

export default CreatePlaylist;
