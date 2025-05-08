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
  Laptop
} from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import NowPlayingInfo from './NowPlayingInfo';
import { useMusic } from '@/contexts/MusicContext';

const MusicPlayer = () => {
  const { currentTrack, isPlaying, play, pause, resume, progress, duration, volume, seek, setVolume } = useMusic();

  // Chuyển đổi giây thành định dạng "phút:giây"
  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Xử lý khi người dùng thay đổi thanh tiến trình
  const handleProgressChange = (values: number[]) => {
    if (duration > 0) {
      const newProgress = values[0];
      const newTime = (newProgress / 100) * duration;
      seek(newTime);
    }
  };

  // Xử lý thay đổi âm lượng
  const handleVolumeChange = (values: number[]) => {
    setVolume(values[0]/100);
  };

  // Xử lý khi nhấn Play/Pause
  const handlePlayPause = () => {
    if (!currentTrack) return;
    
    if (isPlaying) {
      pause();
    } else {
      resume();
    }
  };

  return (
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
          <button 
            className="bg-white text-black rounded-full p-2 hover:scale-105"
            onClick={handlePlayPause}
          >
            {isPlaying && currentTrack ? (
              <Pause size={18} fill="currentColor" />
            ) : (
              <Play size={18} fill="currentColor" />
            )}
          </button>
          <button className="text-spotify-subdued hover:text-spotify-text p-1">
            <SkipForward size={16} />
          </button>
          <button className="text-spotify-subdued hover:text-spotify-text p-1">
            <Repeat size={16} />
          </button>
        </div>

        <div className="flex items-center gap-2 w-full">
          <span className="text-xs text-spotify-subdued">
            {formatTime(progress)}
          </span>
          <Slider
            value={[progress && duration ? (progress / duration) * 100 : 0]}
            max={100}
            step={1}
            className="w-full"
            onValueChange={handleProgressChange}
          />
          <span className="text-xs text-spotify-subdued">
            {formatTime(duration)}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="text-spotify-subdued hover:text-spotify-text">
          <ListMusic size={16} />
        </button>
        <button className="text-spotify-subdued hover:text-spotify-text">
          <Laptop size={16} />
        </button>
        <div className="flex items-center gap-2 w-28">
          <Volume2 size={16} className="text-spotify-subdued" />
          <Slider
            value={[volume*100]}
            max={100}
            step={1}
            onValueChange={handleVolumeChange}
          />
        </div>
        <button className="text-spotify-subdued hover:text-spotify-text">
          <Maximize2 size={16} />
        </button>
      </div>
    </div>
  );
};

export default MusicPlayer;