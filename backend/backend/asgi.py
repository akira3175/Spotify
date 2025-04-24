import os
import django

from channels.routing import ProtocolTypeRouter, URLRouter

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from chatbox.routing import websocket_urlpatterns 
import django.core.asgi
from channels.auth import AuthMiddlewareStack

application = ProtocolTypeRouter({
    "http": django.core.asgi.get_asgi_application(),
    "websocket": AuthMiddlewareStack(
        URLRouter(websocket_urlpatterns)
    ),
})
