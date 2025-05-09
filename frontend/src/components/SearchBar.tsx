import React, { useState } from 'react';
import { Command, CommandInput, CommandList, CommandItem } from "@/components/ui/command";
import { useNavigate } from 'react-router-dom';

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    console.log("Searching for:", value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate('/search?q=' + encodeURIComponent(searchQuery.trim()));
    }
  };

  return (
    <div className="relative w-64 ml-4">
      <Command className="rounded-full overflow-visible bg-zinc-900 border-none w-full">
        <div className="flex items-center px-3 bg-zinc-800 rounded-full">
          <CommandInput
            placeholder="Search..."
            value={searchQuery}
            onValueChange={handleSearch}
            onKeyDown={handleKeyDown}
            className="h-9 bg-transparent focus:outline-none border-0 px-2 text-sm"
          />
        </div>
        <CommandList>
          {searchQuery && (
            <CommandItem onSelect={() => navigate('/search?q=' + encodeURIComponent(searchQuery))}>
              Search "{searchQuery}"
            </CommandItem>
          )}
        </CommandList>
      </Command>
    </div>
  );
};

export default SearchBar;
