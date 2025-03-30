from django.urls import path
from .views import *

urlpatterns = [
    path('', ArtistListCreateView.as_view(), name='artist-list-create'),
    path('<int:pk>/', ArtistRetrieveUpdateDestroyView.as_view(), name='artist-detail'),
]
