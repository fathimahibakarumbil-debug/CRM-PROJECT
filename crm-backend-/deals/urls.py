from django.urls import path
from .views import *

urlpatterns = [
    # DEAL
    path("", deal_list_create),
    path("<int:id>/", deal_detail),
    path("update/<int:pk>/", update_deal),
    path("delete/<int:pk>/", delete_deal),
    path("activity/<int:deal_id>/", add_activity),
    path("activity/update/<int:pk>/", update_activity),
    path("activity/delete/<int:pk>/", delete_activity),
    path("<int:deal_id>/attachments/", upload_attachment),
    path("attachments/<int:pk>/", delete_attachment),
    path("emails/delete/<int:pk>/", delete_email),
]