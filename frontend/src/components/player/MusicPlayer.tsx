
import React, { useState, useEffect } from 'react';
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
  const { currentTrack, isPlaying, play, pause, resume } = useMusic();
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(70);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  // Giả lập tiến trình phát nhạc khi có bài hát và đang phát
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (currentTrack && isPlaying) {
      // Lấy thời lượng từ chuỗi "phút:giây"
      const [minutes, seconds] = currentTrack.duration.split(':').map(Number);
      const totalSeconds = minutes * 60 + seconds;
      setDuration(totalSeconds);

      // Giả lập tiến trình phát
      interval = setInterval(() => {
        setCurrentTime(prevTime => {
          const newTime = prevTime + 1;
          if (newTime >= totalSeconds) {
            clearInterval(interval);
            return 0;
          }
          return newTime;
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => {
      clearInterval(interval);
    };
  }, [currentTrack, isPlaying]);

  // Tính phần trăm tiến độ
  useEffect(() => {
    if (duration > 0) {
      setProgress((currentTime / duration) * 100);
    } else {
      setProgress(0);
    }
  }, [currentTime, duration]);

  // Chuyển đổi giây thành định dạng "phút:giây"
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Xử lý khi người dùng thay đổi thanh tiến trình
  const handleProgressChange = (values: number[]) => {
    const newProgress = values[0];
    const newTime = (newProgress / 100) * duration;
    setCurrentTime(newTime);
    setProgress(newProgress);
  };

  // Xử lý thay đổi âm lượng
  const handleVolumeChange = (values: number[]) => {
    setVolume(values[0]);
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
        image={currentTrack?.imageUrl || "/placeholder.svg"} 
        title={currentTrack?.title || "Chưa phát nhạc"} 
        artist={currentTrack?.artist || "Chọn một bài hát để nghe"} 
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
            {formatTime(currentTime)}
          </span>
          <Slider
            value={[progress]}
            max={100}
            step={1}
            className="w-full"
            onValueChange={handleProgressChange}
          />
          <span className="text-xs text-spotify-subdued">
            {currentTrack ? currentTrack.duration : '0:00'}
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
            value={[volume]}
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
