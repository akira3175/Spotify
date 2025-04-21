
import React from 'react';
import PlaylistCard from './PlaylistCard';
import SectionTitle from './SectionTitle';

interface PlaylistGridProps {
  title: string;
  playlists: Array<{
    id: number;
    title: string;
    description: string;
    image: string;
  }>;
  seeAllLink?: string;
}

const PlaylistGrid = ({ title, playlists, seeAllLink }: PlaylistGridProps) => {
  return (
    <section className="mb-8">
      <SectionTitle title={title} seeAllLink={seeAllLink} />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {playlists.map(playlist => (
          <PlaylistCard 
            key={playlist.id}
            image={playlist.image}
            title={playlist.title}
            description={playlist.description}
          />
        ))}
      </div>
    </section>
  );
};

export default PlaylistGrid;
