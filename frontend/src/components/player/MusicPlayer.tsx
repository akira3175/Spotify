"use client"

import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Repeat,
  Shuffle,
  Volume2,
  Maximize2,
  ListMusic,
  Laptop,
  Download,
  Video,
  X,
} from "lucide-react"
import { Slider } from "@/components/ui/slider"
import NowPlayingInfo from "./NowPlayingInfo"
import { useMusic } from "@/contexts/MusicContext"
import { useState, useRef, useEffect } from "react"

const MusicPlayer = () => {
  const { currentTrack, isPlaying, play, pause, resume, progress, duration, volume, seek, setVolume, audioRef } = useMusic()
  const [showVideo, setShowVideo] = useState(false)
  const [videoIsPlaying, setVideoIsPlaying] = useState(false)
  const [isRepeat, setIsRepeat] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [musicWasPlaying, setMusicWasPlaying] = useState(false)

  // Chuyển đổi giây thành định dạng "phút:giây"
  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return "0:00"
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`
  }

  // Xử lý khi người dùng thay đổi thanh tiến trình
  const handleProgressChange = (values: number[]) => {
    if (duration > 0) {
      const newProgress = values[0]
      const newTime = (newProgress / 100) * duration
      seek(newTime)

      // Đồng bộ video với thanh tiến trình nếu đang hiển thị video
      if (showVideo && videoRef.current) {
        videoRef.current.currentTime = newTime
      }
    }
  }

  // Xử lý thay đổi âm lượng
  const handleVolumeChange = (values: number[]) => {
    const newVolume = values[0] / 100
    setVolume(newVolume)

    // Đồng bộ âm lượng video
    if (videoRef.current) {
      videoRef.current.volume = newVolume
    }
  }

  // Xử lý khi nhấn Play/Pause
  const handlePlayPause = () => {
    if (!currentTrack) return

    if (isPlaying) {
      pause()
      if (videoRef.current && showVideo) videoRef.current.pause()
    } else {
      resume()
      if (videoRef.current && showVideo) videoRef.current.play()
    }
  }

  // Xử lý tải video
  const handleDownload = () => {
    const videoUrl = currentTrack?.audio
    if (!videoUrl) return

    // Tạo một thẻ a ẩn để tải xuống
    const a = document.createElement("a")
    a.href = videoUrl
    a.download = `${currentTrack?.song_name || "video"}.mp4`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  // Mở video và tạm dừng nhạc
  const handleOpenVideo = () => {
    if (!currentTrack?.audio) return
    
    // Lưu trạng thái phát nhạc hiện tại
    setMusicWasPlaying(isPlaying)
    
    // Tạm dừng nhạc khi mở video
    if (isPlaying) {
      pause()
    }
    
    setShowVideo(true)
  }

  // Xử lý khi nhấn nút lặp lại
  const handleRepeat = () => {
    setIsRepeat(!isRepeat)
    if (audioRef.current) {
      audioRef.current.loop = !isRepeat
    }
  }

  // Xử lý khi đóng video
  const handleCloseVideo = () => {
    // Đảm bảo state được cập nhật
    setShowVideo(false)
    
    // Phát lại nhạc nếu nhạc đang phát trước khi mở video
    if (musicWasPlaying) {
      setTimeout(() => {
        resume()
      }, 100)
    }
    
    // Dừng video nếu đang phát
    if (videoRef.current) {
      videoRef.current.pause()
      setVideoIsPlaying(false)
    }
  }

  // Đồng bộ thời gian video với tiến trình phát nhạc
  useEffect(() => {
    if (videoRef.current && showVideo && Math.abs(videoRef.current.currentTime - progress) > 0.5) {
      videoRef.current.currentTime = progress
    }
  }, [progress, showVideo])

  // Xử lý các phím tắt (ví dụ: Escape để đóng video)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && showVideo) {
        handleCloseVideo()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [showVideo])

  return (
    <>
      {showVideo && currentTrack?.audio && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center">
          <div className="relative w-full max-w-4xl">
            <button
              onClick={handleCloseVideo}
              className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 z-10"
              aria-label="Đóng video"
            >
              <X size={20} />
            </button>
            <video
              ref={videoRef}
              src={currentTrack?.audio}
              className="w-full rounded-lg shadow-lg"
              controls={true}
              autoPlay={true}
              onPlay={() => setVideoIsPlaying(true)}
              onPause={() => setVideoIsPlaying(false)}
            />
          </div>
        </div>
      )}

      <div className="h-20 bg-spotify-elevated-base border-t border-zinc-800 px-4 flex items-center justify-between">
        <NowPlayingInfo
          image={currentTrack?.thumbnail || "/placeholder.svg"}
          title={currentTrack?.song_name || "Chưa phát nhạc"}
          artist={currentTrack?.artist.artist_name || "Chọn một bài hát để nghe"}
        />

        <div className="flex flex-col items-center justify-center max-w-3xl w-full">
          <div className="flex items-center justify-center gap-4 mb-1">
            <button className="text-spotify-subdued hover:text-spotify-text p-1">
              <Shuffle size={16} />
            </button>
            <button className="text-spotify-subdued hover:text-spotify-text p-1">
              <SkipBack size={16} />
            </button>
            <button className="bg-white text-black rounded-full p-2 hover:scale-105" onClick={handlePlayPause}>
              {isPlaying && currentTrack ? (
                <Pause size={18} fill="currentColor" />
              ) : (
                <Play size={18} fill="currentColor" />
              )}
            </button>
            <button className="text-spotify-subdued hover:text-spotify-text p-1">
              <SkipForward size={16} />
            </button>
            <button 
              className={`p-1 rounded-full transition-colors duration-150
                ${isRepeat ? 'text-spotify-green bg-spotify-elevated-base ring-2 ring-spotify-green' : 'text-spotify-subdued hover:text-spotify-text'}`}
              onClick={handleRepeat}
              title={isRepeat ? 'Lặp lại: Bật' : 'Lặp lại: Tắt'}
            >
              <Repeat size={16} />
            </button>
          </div>

          <div className="flex items-center gap-2 w-full">
            <span className="text-xs text-spotify-subdued">{formatTime(progress)}</span>
            <Slider
              value={[progress && duration ? (progress / duration) * 100 : 0]}
              max={100}
              step={1}
              className="w-full"
              onValueChange={handleProgressChange}
            />
            <span className="text-xs text-spotify-subdued">{formatTime(duration)}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            className={`${currentTrack?.audio ? "text-spotify-text" : "text-spotify-subdued"} hover:text-spotify-text`}
            onClick={handleOpenVideo}
            disabled={!currentTrack?.audio}
            title={currentTrack?.audio ? "Xem video" : "Không có video"}
          >
            <Video size={16} />
          </button>
          <button
            className={`${currentTrack?.audio ? "text-spotify-text" : "text-spotify-subdued"} hover:text-spotify-text`}
            onClick={handleDownload}
            disabled={!currentTrack?.audio}
            title={currentTrack?.audio ? "Tải video" : "Không có video để tải"}
          >
            <Download size={16} />
          </button>
          <button className="text-spotify-subdued hover:text-spotify-text">
            <ListMusic size={16} />
          </button>
          <button className="text-spotify-subdued hover:text-spotify-text">
            <Laptop size={16} />
          </button>
          <div className="flex items-center gap-2 w-28">
            <Volume2 size={16} className="text-spotify-subdued" />
            <Slider value={[volume * 100]} max={100} step={1} onValueChange={handleVolumeChange} />
          </div>
          <button className="text-spotify-subdued hover:text-spotify-text">
            <Maximize2 size={16} />
          </button>
        </div>
      </div>
    </>
  )
}

export default MusicPlayer