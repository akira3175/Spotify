import React from 'react';
import { Home, Search, Library, Plus, Heart, Users, ShoppingCart } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import Logo from './Logo';
import NavLink from './NavLink';
import PlaylistItem from './PlaylistItem';
import { Link, useLocation } from 'react-router-dom';
import { useMusic } from '@/contexts/MusicContext';

const Sidebar = () => {
  const location = useLocation();
  const { playlists } = useMusic();
  
  // Sample artists for the sidebar
  const followedArtists = [
    { id: 1, name: 'Queen', type: 'artist' },
    { id: 2, name: 'Led Zeppelin', type: 'artist' },
    { id: 3, name: 'The Beatles', type: 'artist' },
    { id: 4, name: 'Pink Floyd', type: 'artist' },
  ];
  
  return (
    <div className="w-64 h-full bg-black flex flex-col">
      <div className="p-6">
        <Logo />
      </div>
      
      <div className="px-2">
        <Link to="/">
          <NavLink icon={<Home size={24} />} label="Home" isActive={location.pathname === '/'} />
        </Link>
        <Link to="/search">
          <NavLink icon={<Search size={24} />} label="Search" isActive={location.pathname === '/search'} />
        </Link>
        <NavLink icon={<Library size={24} />} label="Your Library" />
      </div>
      
      <div className="mt-6 px-2">
        <Link to="/create-playlist">
          <NavLink 
            icon={<Plus size={20} className="text-black bg-spotify-subdued rounded-sm p-0.5" />} 
            label="Create Playlist" 
            isActive={location.pathname === '/create-playlist'}
          />
        </Link>
        <Link to="/purchase-history">
          <NavLink 
            icon={<ShoppingCart size={20} className="bg-orange-500 p-0.5 text-white rounded-sm" />} 
            label="Purchase History" 
            isActive={location.pathname === '/purchase-history'}
          />
        </Link>
        <Link to="/friends">
          <NavLink 
            icon={<Users size={20} className="bg-blue-500 p-0.5 text-white rounded-sm" />} 
            label="Friends" 
            isActive={location.pathname.startsWith('/friends') || location.pathname.startsWith('/chat')}
          />
        </Link>
        <Link to="/liked-songs">
          <NavLink 
            icon={<Heart size={20} className="bg-gradient-to-br from-indigo-500 to-blue-300 p-0.5 text-white rounded-sm" />} 
            label="Liked Songs" 
            isActive={location.pathname === '/liked-songs'}
          />
        </Link>
      </div>
      
      <div className="h-px bg-zinc-800 mx-5 my-3"></div>
      
      <ScrollArea className="flex-1 px-2">
        <div className="pb-2">
          <h3 className="px-4 text-xs uppercase font-semibold text-zinc-400 tracking-wider mb-2">Your Playlists</h3>
          {playlists && playlists.length > 0 ? (
            playlists.map(playlist => (
              <PlaylistItem 
                key={playlist.id}
                name={playlist.playlist_name} 
                type="playlist" 
                id={playlist.id} 
              />
            ))
          ) : (
            <p className="px-4 text-xs text-zinc-500">No playlists created yet.</p>
          )}
        </div>
        
        <div className="pb-6 pt-2">
          <h3 className="px-4 text-xs uppercase font-semibold text-zinc-400 tracking-wider mb-2">Following</h3>
          {followedArtists.map(artist => (
            <PlaylistItem 
              key={artist.id}
              name={artist.name} 
              type={artist.type} 
              id={artist.id} 
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default Sidebar;
