
import React from 'react';
import { Heart } from 'lucide-react';

interface NowPlayingInfoProps {
  image: string;
  title: string;
  artist: string;
}

const NowPlayingInfo = ({ image, title, artist }: NowPlayingInfoProps) => {
  return (
    <div className="flex items-center gap-4 w-[30%]">
      <div className="h-14 w-14 rounded bg-zinc-800 overflow-hidden">
        <img src={image} alt={title} className="object-cover h-full w-full" />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium truncate">{title}</h4>
        <p className="text-xs text-spotify-subdued truncate">{artist}</p>
      </div>
      <button className="text-spotify-subdued hover:text-spotify-bright-accent">
        <Heart size={16} />
      </button>
    </div>
  );
};

export default NowPlayingInfo;
