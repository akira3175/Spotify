import { useEffect, useState } from 'react';

export function useVideoThumbnail(videoUrl: string | undefined, seekTo = 1): string | null {
  const [thumbnail, setThumbnail] = useState<string | null>(null);

  useEffect(() => {
    if (!videoUrl) return;

    const video = document.createElement('video');
    video.src = videoUrl;
    video.crossOrigin = 'anonymous';
    video.muted = true;
    video.playsInline = true;

    const capture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageUrl = canvas.toDataURL('image/png');
        setThumbnail(imageUrl);
      }
    };

    video.addEventListener('loadeddata', () => {
      video.currentTime = seekTo;
    });

    video.addEventListener('seeked', capture);

    return () => {
      video.removeEventListener('loadeddata', () => {});
      video.removeEventListener('seeked', capture);
    };
  }, [videoUrl, seekTo]);

  return thumbnail;
}
