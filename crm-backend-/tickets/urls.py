from django.urls import path
from .views import ticket_list, ticket_detail

urlpatterns = [
    path('', ticket_list),
    path('<int:pk>/', ticket_detail),
]
 