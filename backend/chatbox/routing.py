from django.urls import re_path
from .consumers import ChatboxConsumer

websocket_urlpatterns = [
    re_path(r'ws/chat/(?P<chatbox_id>\w+)/$', ChatboxConsumer.as_asgi()),
]
