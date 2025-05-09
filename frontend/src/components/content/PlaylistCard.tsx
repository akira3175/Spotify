import React from 'react';
import { Play } from 'lucide-react';

interface PlaylistCardProps {
  image: string;
  title: string | null;
  description: string;
  onClick?: () => void;
}

const PlaylistCard = ({ image, title, description, onClick }: PlaylistCardProps) => {
  return (
    <div className="spotify-card group relative" onClick={onClick}>
      <div className="relative">
        <div className="h-40 w-full mb-4 bg-zinc-800 rounded-md overflow-hidden shadow-lg">
          <img src={image} alt={title ?? ''} className="object-cover h-full w-full" />
        </div>
        <button className="absolute bottom-2 right-2 bg-spotify-bright-accent rounded-full p-3 shadow-lg opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200">
          <Play size={20} fill="black" className="text-black ml-0.5" />
        </button>
      </div>
      <h3 className="font-bold mb-1 truncate">{title}</h3>
      <p className="text-sm text-spotify-subdued line-clamp-2">{description}</p>
    </div>
  );
};

export default PlaylistCard;
