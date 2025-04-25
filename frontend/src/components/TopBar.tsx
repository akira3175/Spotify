
import React from 'react';
import { ChevronLeft, ChevronRight, Bell, User, LogIn, Search, Music, ShoppingCart, UserPlus, Plus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import SearchBar from './SearchBar';

const TopBar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="flex justify-between items-center h-16 px-6 sticky top-0 z-30 bg-spotify-base bg-opacity-95">
      <div className="flex items-center gap-2">
        <button className="bg-black bg-opacity-70 rounded-full p-1">
          <ChevronLeft size={24} />
        </button>
        <button className="bg-black bg-opacity-70 rounded-full p-1">
          <ChevronRight size={24} />
        </button>
        
        {isAuthenticated && <SearchBar />}
      </div>
      
      <div className="flex items-center gap-4">
        {isAuthenticated ? (
          <>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-sm font-normal gap-1" 
              onClick={() => navigate('/create-playlist')}
            >
              <Plus size={16} /> Create Playlist
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Music size={18} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => navigate('/search')}>
                  <Search size={16} className="mr-2" /> Browse Music
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/purchase-history')}>
                  <ShoppingCart size={16} className="mr-2" /> Purchase History
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <UserPlus size={18} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => navigate('/friends')}>
                  <UserPlus size={16} className="mr-2" /> Find Friends
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/friends?tab=pending')}>
                  <Bell size={16} className="mr-2" /> Friend Requests
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="bg-black p-0.5 rounded-full hover:scale-105 transition-transform flex items-center">
                  <div className="h-7 w-7 bg-zinc-600 rounded-full flex items-center justify-center">
                    {user?.avatarUrl ? (
                      <img 
                        src={user.avatarUrl} 
                        alt={user.first_name + " " + user.last_name} 
                        className="h-full w-full rounded-full object-cover"
                      />
                    ) : (
                      <User size={16} />
                    )}
                  </div>
                  <span className="ml-2 text-sm font-medium text-white">
                    {user?.first_name + " " + user?.last_name}
                  </span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-zinc-800 border-zinc-700 text-white">
                <DropdownMenuItem className="hover:bg-zinc-700 cursor-pointer" onClick={() => navigate('/profile')}>
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-zinc-700 cursor-pointer" onClick={() => navigate('/purchase-history')}>
                  Purchase History
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-zinc-700 cursor-pointer" onClick={() => navigate('/friends')}>
                  Friends
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-zinc-700" />
                <DropdownMenuItem className="hover:bg-zinc-700 cursor-pointer">
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-zinc-700 cursor-pointer" onClick={logout}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ) : (
          <div className="flex items-center gap-3">
            <Link to="/register">
              <Button variant="ghost" className="text-white hover:text-white hover:bg-zinc-800">
                Sign Up
              </Button>
            </Link>
            <Link to="/login">
              <Button className="bg-white text-black hover:bg-gray-200 font-bold">
                <LogIn size={16} className="mr-1" />
                Log In
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopBar;
