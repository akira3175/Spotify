import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { PlaylistService } from "@/services/PlaylistService"
import type { Playlist } from "@/types/playlist"
import type { Song } from "@/types/music"
import { PlusCircle, ListPlus } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { CreatePlaylistModal } from "./CreatePlaylistModal"
import { useMusic } from "@/contexts/MusicContext"

interface AddToPlaylistButtonProps {
  song: Song
}

export function AddToPlaylistButton({ song }: AddToPlaylistButtonProps) {
  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const [loading, setLoading] = useState(false)
  const [addingToPlaylist, setAddingToPlaylist] = useState<number | null>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const { toast } = useToast()
  const { addSongToPlaylist } = useMusic()

  const fetchUserPlaylists = async () => {
    try {
      setLoading(true)
      // Assuming you have a method to get user playlists
      const userPlaylists = await PlaylistService.getPlaylist()
      setPlaylists(userPlaylists)
    } catch (error) {
      console.error("Failed to fetch playlists:", error)
      toast({
        title: "Error",
        description: "Failed to load your playlists",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUserPlaylists()
  }, [toast])

  const addSongToPlaylistHandler = async (playlistId: number) => {
    try {
      setAddingToPlaylist(playlistId)

      // Get the current playlist
      const playlist = await PlaylistService.getPlaylistById(playlistId)

      // Check if song is already in the playlist
      const songExists = playlist.song.some((s) => s.id === song.id)

      if (songExists) {
        toast({
          title: "Already added",
          description: `"${song.song_name}" is already in this playlist`,
          variant: "default",
        })
        return
      }

      // Add the song to the playlist
      await addSongToPlaylist(song.id, playlist)

      toast({
        title: "Success",
        description: `Added "${song.song_name}" to ${playlist.playlist_name}`,
        variant: "default",
      })
    } catch (error) {
      console.error("Failed to add song to playlist:", error)
      toast({
        title: "Error",
        description: "Failed to add song to playlist",
        variant: "destructive",
      })
    } finally {
      setAddingToPlaylist(null)
    }
  }

  const handleCreatePlaylist = () => {
    setIsCreateModalOpen(true)
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:text-spotify-green"
            aria-label="Add to playlist"
          >
            <ListPlus className="h-6 w-6" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 bg-zinc-900 border-zinc-800">
          <DropdownMenuLabel className="text-zinc-400">Add to playlist</DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-zinc-800" />
          {loading ? (
            <DropdownMenuItem disabled>Loading playlists...</DropdownMenuItem>
          ) : playlists.length === 0 ? (
            <DropdownMenuItem disabled>No playlists found</DropdownMenuItem>
          ) : (
            playlists.map((playlist) => (
              <DropdownMenuItem
                key={playlist.id}
                onClick={() => addSongToPlaylistHandler(playlist.id)}
                disabled={addingToPlaylist === playlist.id}
                className="flex items-center justify-between cursor-pointer hover:bg-zinc-800"
              >
                <span>{playlist.playlist_name}</span>
                {addingToPlaylist === playlist.id ? (
                  <span className="text-spotify-green animate-pulse">Adding...</span>
                ) : (
                  <PlusCircle className="h-4 w-4 text-zinc-400" />
                )}
              </DropdownMenuItem>
            ))
          )}
          <DropdownMenuSeparator className="bg-zinc-800" />
          <DropdownMenuItem className="cursor-pointer hover:bg-zinc-800" onClick={handleCreatePlaylist}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Create new playlist
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <CreatePlaylistModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={fetchUserPlaylists}
      />
    </>
  )
}
