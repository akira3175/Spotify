
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Command, CommandInput } from "@/components/ui/command";
import { useNavigate } from 'react-router-dom';

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  
  const handleSearch = (value: string) => {
    setSearchQuery(value);
    // In a real app, this would trigger a search request
    console.log("Searching for:", value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate('/search');
    }
  };

  return (
    <div className="relative w-64 ml-4">
      <div className="relative flex items-center">
        <Command className="rounded-full overflow-visible bg-zinc-900 border-none w-full">
          <div className="flex items-center px-3 bg-zinc-800 rounded-full">
            <Search className="h-4 w-4 shrink-0 text-spotify-subdued" />
            <CommandInput 
              placeholder="Search..." 
              value={searchQuery}
              onValueChange={handleSearch}
              onKeyDown={handleKeyDown}
              className="h-9 bg-transparent focus:outline-none border-0 px-2 text-sm"
            />
          </div>
        </Command>
      </div>
    </div>
  );
};

export default SearchBar;
