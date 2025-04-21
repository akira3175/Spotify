
import React from 'react';

interface SectionTitleProps {
  title: string;
  seeAllLink?: string;
}

const SectionTitle = ({ title, seeAllLink }: SectionTitleProps) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-2xl font-bold hover:underline cursor-pointer">{title}</h2>
      {seeAllLink && (
        <a href={seeAllLink} className="text-sm font-bold text-spotify-subdued hover:underline">
          Show all
        </a>
      )}
    </div>
  );
};

export default SectionTitle;
