import { Link } from 'react-router-dom';

interface PlaylistItemProps {
  name: string;
  type: string;
  id?: number;
  linkTo?: string;
}

const PlaylistItem = ({ name, type, id, linkTo }: PlaylistItemProps) => {
  const defaultLinkTo = type === 'playlist' ? `/playlist/${id || 1}` : 
                         type === 'artist' ? `/artist/${id || 1}` : '#';
  
  const finalLinkTo = linkTo || defaultLinkTo;

  return (
    <Link to={finalLinkTo} className="block">
      <div className="playlist-item py-2 px-4 hover:bg-zinc-900 rounded-md transition-colors cursor-pointer">
        <span className="text-sm text-zinc-400 hover:text-white transition-colors truncate block">{name}</span>
      </div>
    </Link>
  );
};

export default PlaylistItem;
