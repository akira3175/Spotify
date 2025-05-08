"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { PlaylistService } from "@/services/PlaylistService"
import { useToast } from "@/components/ui/use-toast"

interface CreatePlaylistModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function CreatePlaylistModal({ isOpen, onClose, onSuccess }: CreatePlaylistModalProps) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) {
      toast({
        title: "Error",
        description: "Playlist name is required",
        variant: "destructive",
      })
      return
    }

    try {
      setLoading(true)
      await PlaylistService.createPlaylist({
        id: 0,
        is_deleted: false,
        price: 0,
        playlist_name: name,
        description: description,
        followers: 0,
        totalSongs: 0,
        created_at: new Date().toISOString(),
        is_public: true,
        playlist_cover_url: "/placeholder.svg",
        song: [],
      })

      toast({
        title: "Success",
        description: `Playlist "${name}" created successfully`,
        variant: "default",
      })

      setName("")
      setDescription("")
      onSuccess()
      onClose()
    } catch (error) {
      console.error("Failed to create playlist:", error)
      toast({
        title: "Error",
        description: "Failed to create playlist",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-zinc-900 border-zinc-800 text-white">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create new playlist</DialogTitle>
            <DialogDescription className="text-zinc-400">
              Create a new playlist to add songs to your collection.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name" className="text-white">
                Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="My Awesome Playlist"
                className="bg-zinc-800 border-zinc-700"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description" className="text-white">
                Description
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add an optional description"
                className="bg-zinc-800 border-zinc-700"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="bg-transparent border-zinc-700 text-white hover:bg-zinc-800"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="bg-spotify-green hover:bg-spotify-green/90 text-black">
              {loading ? "Creating..." : "Create Playlist"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
