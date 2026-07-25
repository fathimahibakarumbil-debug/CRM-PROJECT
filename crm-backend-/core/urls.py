from django.urls import path
from .views import global_search

urlpatterns = [
path('global-search/', global_search),
]