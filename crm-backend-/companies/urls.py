from django.urls import path
from .views import *

urlpatterns = [
    path("", company_list_create),
    path("<int:pk>/", company_detail),
    path("tasks/", company_task_list_create),
    path("notes/", company_note_list_create),
    path("calls/", company_call_list_create),
    path("meetings/", company_meeting_list_create),
    path("emails/", company_email_list_create),
    path("activity/<int:company_id>/", company_activity),
    path("<int:company_id>/attachments/", upload_company_attachment),
    path("attachments/<int:pk>/", delete_company_attachment),
]