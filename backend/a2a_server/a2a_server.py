import os
import sys
import logging
import json
from logging.handlers import RotatingFileHandler
from dotenv import load_dotenv
import google.generativeai as genai
from django.db import transaction
from songs.models import Song, Genres
from artists.models import Artist
from django.db.models import Count, Sum

# Configure logging
try:
    log_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'logs')
    if not os.path.exists(log_dir):
        os.makedirs(log_dir)

    log_file = os.path.join(log_dir, 'a2a_server.txt')
    max_bytes = 5 * 1024 * 1024  # 5MB
    backup_count = 3
    file_handler = RotatingFileHandler(log_file, maxBytes=max_bytes, backupCount=backup_count, encoding='utf-8', mode='a')
    file_handler.setLevel(logging.DEBUG)
    file_formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - [%(filename)s:%(lineno)d] - %(message)s')
    file_handler.setFormatter(file_formatter)

    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setLevel(logging.DEBUG)
    console_formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')
    console_handler.setFormatter(console_formatter)

    logging.basicConfig(
        level=logging.DEBUG,
        handlers=[console_handler, file_handler]
    )
    logger = logging.getLogger(__name__)
    logger.setLevel(logging.DEBUG)

    logger.info("="*50)
    logger.info("A2A Server Starting")
    logger.info(f"Python version: {sys.version}")
    logger.info(f"Current working directory: {os.getcwd()}")
    logger.info(f"Log file location: {log_file}")
    logger.info("="*50)

except Exception as e:
    print(f"Error configuring logging: {str(e)}")
    print(traceback.format_exc())
    logger.error(f"Error configuring logging: {str(e)}")
    logger.error(f"Traceback: {traceback.format_exc()}")
    raise

# Load environment variables
load_dotenv()
logger.info("Environment variables loaded")

# Configure Gemini API
api_key = os.getenv('GOOGLE_API_KEY')
if not api_key:
    logger.error("GOOGLE_API_KEY is not set in the environment")
    raise ValueError("GOOGLE_API_KEY is not set in the environment")
genai.configure(api_key=api_key)
logger.info("Gemini API configured successfully")

class A2AServer:
    def __init__(self):
        self.model = genai.GenerativeModel(model_name='gemini-1.5-flash')
        logger.info("A2A Server initialized")

    def get_songs(self):
        """Lấy danh sách bài hát"""
        try:
            songs = Song.objects.filter(is_deleted=False).select_related('artist').prefetch_related('genres')
            return [(s.id, s.song_name, s.price, s.artist.artist_name, [g.genre_name for g in s.genres.all()]) for s in songs]
        except Exception as e:
            logger.error(f"Error getting songs: {str(e)}")
            return []

    def get_artists(self):
        """Lấy danh sách nghệ sĩ"""
        try:
            artists = Artist.objects.filter(is_deleted=False).prefetch_related('genres')
            return [(a.id, a.artist_name, [g.genre_name for g in a.genres.all()]) for a in artists]
        except Exception as e:
            logger.error(f"Error getting artists: {str(e)}")
            return []

    def get_genres(self):
        """Lấy danh sách thể loại"""
        try:
            return list(Genres.objects.values_list('genre_name', flat=True))
        except Exception as e:
            logger.error(f"Error getting genres: {str(e)}")
            return []

    def get_total_songs(self):
        """Lấy tổng số bài hát"""
        try:
            return Song.objects.filter(is_deleted=False).count()
        except Exception as e:
            logger.error(f"Error getting total songs: {str(e)}")
            return 0

    def get_total_artists(self):
        """Lấy tổng số nghệ sĩ"""
        try:
            return Artist.objects.filter(is_deleted=False).count()
        except Exception as e:
            logger.error(f"Error getting total artists: {str(e)}")
            return 0

    def process_song_prediction_request(self, input_text, user_id):
        """Xử lý yêu cầu dự đoán tên bài hát"""
        try:
            # Lấy dữ liệu từ database
            songs_data = self.get_songs()
            genres = self.get_genres()
            # Tạo prompt cho Gemini
            context = f"""
            Danh sách các bài hát hiện có (mẫu - id, tên bài hát, giá, nghệ sĩ, thể loại):
            {json.dumps(songs_data[:100], ensure_ascii=False, indent=2, default=str)}

            Các thể loại nhạc hiện có:
            {json.dumps(genres, ensure_ascii=False, indent=2)}

            Dựa vào thông tin này, hãy cố gắng dự đoán tên bài hát mà người dùng đang mô tả.
            """

            prompt = f"""
            Context: {context}

            User keywords/description: {input_text}

            Hãy dự đoán tên bài hát mà người dùng đang nghĩ đến dựa trên những từ khóa hoặc mô tả họ cung cấp.
            Nếu bạn không chắc chắn, hãy đưa ra tối đa 3 gợi ý có khả năng phù hợp nhất.

            Format câu trả lời:
            - Phần đầu: Tên bài hát dự đoán (hoặc "Có thể là một trong những bài sau:")
            - Phần sau (nếu không chắc chắn): Danh sách các bài hát gợi ý (tên bài hát - nghệ sĩ - thể loại)
            """


            # Gọi Gemini API
            response = self.model.generate_content(prompt)

            if not response or not hasattr(response, 'text') or not response.text:
                logger.error("Empty or invalid response from Gemini")
                return "Xin lỗi, không thể dự đoán tên bài hát lúc này. Vui lòng thử lại sau."

            return response.text

        except Exception as e:
            logger.error(f"Error processing song prediction request: {str(e)}")
            return "Xin lỗi, có lỗi xảy ra khi xử lý yêu cầu của bạn. Vui lòng thử lại sau."

# Khởi tạo instance của A2AServer
a2a_server = A2AServer()
