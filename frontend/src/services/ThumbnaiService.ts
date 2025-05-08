export class ThumbnailService {
  /**
   * Lấy thumbnail cho bài hát từ video MP4
   * @param audioUrl URL của file audio/video
   * @param defaultImage Ảnh mặc định nếu không tìm thấy thumbnail
   * @returns Promise với URL của thumbnail
   */
  static async getThumbnailFromAudio(audioUrl: string, defaultImage: string = '/placeholder.svg'): Promise<string> {
    try {
      if (!audioUrl) return defaultImage;
      
      // Kiểm tra nếu URL không phải là MP4, trả về ảnh mặc định
      if (!audioUrl.toLowerCase().endsWith('.mp4')) {
        console.log('URL không phải là MP4, không thể lấy thumbnail:', audioUrl);
        return defaultImage;
      }
      
      // Tạo URL thumbnail từ URL video MP4
      // Ví dụ: /videos/song-123.mp4 -> /videos/thumbnails/song-123.jpg
      const videoId = this.extractSongIdFromUrl(audioUrl);
      if (videoId) {
        // Phương pháp 1: Dùng API endpoint riêng để lấy thumbnail
        const thumbnailUrl = `/api/video-thumbnails/${videoId}`;
        
        // Kiểm tra xem thumbnail có tồn tại không
        if (await this.urlExists(thumbnailUrl)) {
          console.log('Thumbnail tồn tại:', thumbnailUrl);
          return thumbnailUrl;
        }
      }
      
      // Phương pháp 2: Chuyển đổi URL trực tiếp
      // Từ: /videos/song.mp4 -> /videos/thumbnails/song.jpg
      const thumbnailPath = audioUrl
        .replace(/\.(mp4)$/i, '.jpg')
        .replace(/\/videos\//i, '/videos/thumbnails/');
      
      if (await this.urlExists(thumbnailPath)) {
        console.log('Tìm thấy thumbnail từ đường dẫn biến đổi:', thumbnailPath);
        return thumbnailPath;
      }
      
      // Phương pháp 3: Sử dụng thời gian để tạo URL thumbnail tránh cache
      // Một số server tạo thumbnail theo yêu cầu
      const timestamp = new Date().getTime();
      const dynamicThumbnail = `${audioUrl.replace(/\.(mp4)$/i, '')}_thumbnail.jpg?t=${timestamp}`;
      
      if (await this.urlExists(dynamicThumbnail)) {
        console.log('Tìm thấy thumbnail động:', dynamicThumbnail);
        return dynamicThumbnail;
      }
      
      // Nếu không tìm thấy thumbnail, trả về ảnh mặc định
      console.log('Không tìm thấy thumbnail, sử dụng ảnh mặc định');
      return defaultImage;
    } catch (error) {
      console.error('Lỗi khi tìm thumbnail từ MP4:', error);
      return defaultImage;
    }
  }
  
  /**
   * Trích xuất ID bài hát từ URL video
   * @param videoUrl URL của file video MP4
   * @returns ID của video hoặc null nếu không tìm thấy
   */
  static extractSongIdFromUrl(videoUrl: string): string | null {
    if (!videoUrl) return null;
    
    // Trích xuất ID từ URL
    // Giả sử URL có dạng: /videos/123.mp4 hoặc /videos/song-123.mp4
    
    // Phương pháp 1: Lấy số từ pathname
    const match = videoUrl.match(/\/(\d+)(\.|\-|\/)/);
    if (match && match[1]) {
      return match[1];
    }
    
    // Phương pháp 2: Lấy phần cuối của URL (trước phần mở rộng)
    const segments = videoUrl.split('/');
    const lastSegment = segments[segments.length - 1];
    const fileNameWithoutExt = lastSegment.split('.')[0];
    
    // Nếu filename là một số hoặc bắt đầu bằng "song-", "video-", v.v.
    if (/^\d+$/.test(fileNameWithoutExt)) {
      return fileNameWithoutExt;
    }
    
    const prefixMatch = fileNameWithoutExt.match(/^(song|video|track)\-(\d+)$/);
    if (prefixMatch && prefixMatch[2]) {
      return prefixMatch[2];
    }
    
    return null;
  }
  
  /**
   * Kiểm tra xem một URL có tồn tại hay không
   * @param url URL cần kiểm tra
   * @returns true nếu URL tồn tại, false nếu không
   */
  static async urlExists(url: string): Promise<boolean> {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      return response.ok;
    } catch {
      return false;
    }
  }
  
  /**
   * Tạo đối tượng HTMLVideoElement để lấy video frame làm thumbnail
   * Chỉ sử dụng phương pháp này trong môi trường browser
   * @param videoUrl URL của video MP4
   * @returns Promise với URL của thumbnail được tạo từ video frame
   */
  static async generateThumbnailFromVideo(videoUrl: string, defaultImage: string = '/placeholder.svg'): Promise<string> {
    return new Promise((resolve) => {
      try {
        // Tạo video element
        const video = document.createElement('video');
        video.crossOrigin = 'anonymous'; // Để tránh CORS error khi vẽ lên canvas
        video.src = videoUrl;
        
        // Xử lý sự kiện khi video đã tải metadata
        video.onloadedmetadata = () => {
          // Tua video đến 25% thời lượng để lấy frame có nội dung
          video.currentTime = video.duration * 0.25;
        };
        
        // Xử lý sự kiện khi video đã tua đến thời điểm cần thiết
        video.onseeked = () => {
          try {
            // Tạo canvas để vẽ frame từ video
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            
            // Vẽ frame video lên canvas
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
              
              // Chuyển đổi canvas thành URL hình ảnh
              const thumbnailUrl = canvas.toDataURL('image/jpeg');
              
              // Giải phóng bộ nhớ
              video.pause();
              video.src = '';
              video.load();
              
              resolve(thumbnailUrl);
            } else {
              console.error('Không thể tạo context 2D cho canvas');
              resolve(defaultImage);
            }
          } catch (err) {
            console.error('Lỗi khi tạo thumbnail từ video frame:', err);
            resolve(defaultImage);
          }
        };
        
        // Xử lý lỗi
        video.onerror = () => {
          console.error('Lỗi khi tải video:', video.error);
          resolve(defaultImage);
        };
        
        // Bắt đầu tải video
        video.load();
        
        // Timeout để tránh chờ mãi không có kết quả
        setTimeout(() => {
          if (video.readyState === 0) { // HAVE_NOTHING
            console.warn('Hết thời gian chờ tải video');
            resolve(defaultImage);
          }
        }, 5000); // Đợi tối đa 5 giây
        
      } catch (error) {
        console.error('Lỗi khi tạo thumbnail từ video:', error);
        resolve(defaultImage);
      }
    });
  }
}