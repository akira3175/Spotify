from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import json
import logging
import os
import sys
import traceback
from dotenv import load_dotenv
from logging.handlers import RotatingFileHandler
from .a2a_server import a2a_server

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
    print(f"Traceback: {traceback.format_exc()}")
    logger.error(f"Error configuring logging: {str(e)}")
    logger.error(f"Traceback: {traceback.format_exc()}")
    raise

# Load environment variables
load_dotenv()
logger.info("Environment variables loaded")

@csrf_exempt
@require_http_methods(["POST"])
def jsonrpc(request):
    try:
        logger.info("="*50)
        logger.info(f"New request received at {request.path}")
        logger.info(f"Request method: {request.method}")
        logger.info(f"Request headers: {dict(request.headers)}")

        body = request.body.decode('utf-8')
        logger.info(f"Request body: {body}")

        if request.content_type == 'application/json':
            try:
                data = json.loads(body)
                logger.info(f"Request JSON data: {data}")
                input_text = data.get('params', {}).get('input_text', '')
                user_id = data.get('params', {}).get('user_id')
            except json.JSONDecodeError:
                logger.error("Invalid JSON format")
                error_response = {
                    'jsonrpc': '2.0',
                    'error': {'code': -32700, 'message': 'Parse error'},
                    'id': None
                }
                return JsonResponse(error_response, status=400)
        else:
            logger.info(f"Request POST data: {request.POST}")
            input_text = request.POST.get('input_text', '')
            user_id = request.POST.get('user_id')
        
        logger.info(f"Extracted parameters - Input text: {input_text}, User ID: {user_id}")
        
        if not input_text or not user_id:
            error_response = {
                'jsonrpc': '2.0',
                'error': {'code': -32602, 'message': 'Tham số không hợp lệ'},
                'id': 1
            }
            logger.error(f"Invalid parameters: {error_response}")
            return JsonResponse(error_response, status=400)

        # Xử lý yêu cầu đề xuất nhạc
        response = a2a_server.process_song_prediction_request(input_text, user_id)
        
        result = {
            'jsonrpc': "2.0",
            'result': response,
            'id': 1
        }
        
        logger.info(f"Sending response: {result}")
        logger.info("="*50)
        return JsonResponse(result)
            
    except Exception as e:
        logger.error(f"Server error: {str(e)}")
        logger.error(f"Traceback (first 1000 chars): {traceback.format_exc()[:1000]}")
        error_response = {
            'jsonrpc': '2.0',
            'error': {'code': -32000, 'message': str(e)},
            'id': None
        }
        return JsonResponse(error_response, status=500) 