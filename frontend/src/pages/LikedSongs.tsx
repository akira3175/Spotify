import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import PlaylistGrid from '@/components/content/PlaylistGrid';
import { useMusic } from '@/contexts/MusicContext';
import { ArtistService } from '@/services/ArtistService';
import { useNavigate } from 'react-router-dom';

const LikedSongsPage = () => {
  const { likedSongs } = useMusic();
  const [artists, setArtists] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    ArtistService.getArtists().then(data => {
      setArtists(Array.isArray(data) ? data : [data]);
    });
  }, []);

  const getArtistName = (artistId: number) => {
    const artist = artists.find((a: any) => a.id === artistId);
    return artist ? artist.artist_name : 'Unknown Artist';
  };

  const handleSongClick = (songId: string) => {
    navigate(`/song/${songId}`);
  };

  return (
    <Layout>
      <div className="p-6 pb-28">
        <h1 className="text-3xl font-bold mb-6">Liked Songs</h1>
        <PlaylistGrid
          title=""
          playlists={likedSongs.map(song => ({
            id: song.id.toString(),
            title: song.title,
            description: getArtistName(song.artistId),
            image: song.imageUrl || '/placeholder.svg'
          }))}
          onPlaylistClick={handleSongClick}
          seeAllLink="#"
        />
      </div>
    </Layout>
  );
};

export default LikedSongsPage; 