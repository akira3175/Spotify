import React from 'react';
import { Link } from 'react-router-dom';
import PlaylistCard from './PlaylistCard';
import SectionTitle from './SectionTitle';

interface Playlist {
  id: string;
  title: string;
  description: string;
  image: string;
}

interface PlaylistGridProps {
  title: string;
  playlists: Playlist[];
  seeAllLink?: string;
  onPlaylistClick?: (id: string) => void;
}

const PlaylistGrid = ({ title, playlists, seeAllLink, onPlaylistClick }: PlaylistGridProps) => {
  return (
    <section className="mb-8">
      <SectionTitle title={title} seeAllLink={seeAllLink} />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {playlists.map((playlist) => (
          <PlaylistCard
            key={playlist.id}
            image={playlist.image}
            title={playlist.title}
            description={playlist.description}
            onClick={() => onPlaylistClick?.(playlist.id)}
          />
        ))}
      </div>
    </section>
  );
};

export default PlaylistGrid;
