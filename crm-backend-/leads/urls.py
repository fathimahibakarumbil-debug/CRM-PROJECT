from django.urls import path
from .views import *

urlpatterns = [
    # LEADS
    path("", lead_list_create),
    path("update/<int:pk>/", update_lead),
    path("delete/<int:pk>/", delete_lead),
    path("<int:pk>/", lead_detail),
    # ACTIVITY (Deals style)
    path("activity/<int:lead_id>/", lead_activity),
    path("activity/update/<int:pk>/", update_activity),
    path("activity/delete/<int:pk>/", delete_activity),
    # ATTACHMENTS
    path("<int:lead_id>/attachments/", upload_attachment),
    path("attachments/<int:pk>/", delete_attachment),
    # convert
    path("convert/<int:pk>/", convert_lead),
    path("<int:lead_id>/send-email/", send_lead_email),
]