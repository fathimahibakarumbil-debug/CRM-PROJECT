from django.shortcuts import render

# Create your views here.
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Lead, Task, Note, Call, Meeting, Email, Attachment
from .serializers import *
from django.shortcuts import get_object_or_404
from django.db.models import Q
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from deals.models import Deal
from .services import get_all_activities
from .services import convert_lead_to_deal
from django.core.exceptions import ObjectDoesNotExist
from django.core.mail import EmailMessage

# ================== LEADS ==================


@api_view(["GET", "POST"])
def lead_list_create(request):
    if request.method == "GET":
        leads = Lead.objects.all().order_by("-createdDate")

        # 🔍 SEARCH
        search = request.GET.get("search")
        if search:
            leads = leads.filter(
                Q(firstName__icontains=search)
                | Q(lastName__icontains=search)
                | Q(email__icontains=search)
                | Q(company__icontains=search)
            )

        # 🎯 FILTERS
        status = request.GET.get("status")
        priority = request.GET.get("priority")
        source = request.GET.get("source")

        if status:
            leads = leads.filter(leadStatus=status)

        if priority:
            leads = leads.filter(priority=priority)

        if source:
            leads = leads.filter(source=source)

        # return Response(LeadSerializer(leads, many=True).data)
        return Response(
            LeadSerializer(leads, many=True, context={"request": request}).data
        )

    if request.method == "POST":
        serializer = LeadSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()

            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)


@api_view(["GET", "DELETE"])
def lead_detail(request, pk):

    lead = get_object_or_404(Lead, pk=pk)

    if request.method == "GET":

        data = LeadSerializer(lead, context={"request": request}).data

        data["activities"] = get_all_activities(lead)

        return Response(data)

    if request.method == "DELETE":
        lead.delete()
        return Response({"message": "Deleted"}, status=204)


@api_view(["PATCH", "PUT"])
def update_lead(request, pk):
    try:
        lead = Lead.objects.get(pk=pk)
    except Lead.DoesNotExist:
        return Response({"error": "Lead not found"}, status=404)
    serializer = LeadSerializer(
        lead,
        data=request.data,
        partial=(request.method == "PATCH"),
        context={"request": request},
    )

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)

    return Response(serializer.errors, status=400)


@api_view(["DELETE"])
def delete_lead(request, pk):
    lead = get_object_or_404(Lead, pk=pk)

    lead.delete()
    return Response({"message": "Deleted"}, status=204)


# ================== COMMON FUNCTION ==================


def get_filtered_queryset(model, request):
    lead_id = request.GET.get("lead_id")

    if lead_id:
        return model.objects.filter(lead_id=lead_id)

    return model.objects.all()


# ================== TASK ==================


@api_view(["GET", "POST"])
def task_list_create(request):
    if request.method == "GET":
        tasks = get_filtered_queryset(Task, request)
        return Response(TaskSerializer(tasks, many=True).data)

    if request.method == "POST":
        serializer = TaskSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)


@api_view(["GET", "PUT", "DELETE"])
def task_detail(request, pk):
    task = get_object_or_404(Task, pk=pk)

    if request.method == "GET":
        return Response(TaskSerializer(task).data)

    if request.method == "PUT":
        serializer = TaskSerializer(task, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=200)

    if request.method == "DELETE":
        task.delete()
        return Response({"message": "Deleted"}, status=204)


# ================== NOTE ==================


@api_view(["GET", "POST"])
def note_list_create(request):
    if request.method == "GET":
        notes = get_filtered_queryset(Note, request)
        return Response(NoteSerializer(notes, many=True).data)

    if request.method == "POST":
        serializer = NoteSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)


@api_view(["GET", "PUT", "DELETE"])
def note_detail(request, pk):
    note = get_object_or_404(Note, pk=pk)

    if request.method == "GET":
        return Response(NoteSerializer(note).data)

    if request.method == "PUT":
        serializer = NoteSerializer(note, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=200)

    if request.method == "DELETE":
        note.delete()
        return Response({"message": "Deleted"}, status=204)


# ================== CALL ==================


@api_view(["GET", "POST"])
def call_list_create(request):
    if request.method == "GET":
        calls = get_filtered_queryset(Call, request)
        return Response(CallSerializer(calls, many=True).data)

    if request.method == "POST":
        serializer = CallSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)


@api_view(["GET", "PUT", "DELETE"])
def call_detail(request, pk):
    call = get_object_or_404(Call, pk=pk)

    if request.method == "GET":
        return Response(CallSerializer(call).data)

    if request.method == "PUT":
        serializer = CallSerializer(call, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=200)

    if request.method == "DELETE":
        call.delete()
        return Response({"message": "Deleted"}, status=204)


# ================== MEETING ==================


@api_view(["GET", "POST"])
def meeting_list_create(request):
    if request.method == "GET":
        meetings = get_filtered_queryset(Meeting, request)
        return Response(MeetingSerializer(meetings, many=True).data)

    if request.method == "POST":
        serializer = MeetingSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)


@api_view(["GET", "PUT", "DELETE"])
def meeting_detail(request, pk):
    meeting = get_object_or_404(Meeting, pk=pk)

    if request.method == "GET":
        return Response(MeetingSerializer(meeting).data)

    if request.method == "PUT":
        serializer = MeetingSerializer(meeting, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=200)

    if request.method == "DELETE":
        meeting.delete()
        return Response({"message": "Deleted"}, status=204)


# ================== EMAIL ==================


@api_view(["GET", "POST"])
def email_list_create(request):
    if request.method == "GET":
        emails = get_filtered_queryset(Email, request)
        return Response(EmailSerializer(emails, many=True).data)

    if request.method == "POST":
        serializer = EmailSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)


@api_view(["GET", "PUT", "DELETE"])
def email_detail(request, pk):
    email = get_object_or_404(Email, pk=pk)

    if request.method == "GET":
        return Response(EmailSerializer(email).data)

    if request.method == "PUT":
        serializer = EmailSerializer(email, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=200)

    if request.method == "DELETE":
        email.delete()
        return Response({"message": "Deleted"}, status=204)

    # ================== ACTIVITY ==================


@api_view(["GET", "POST"])
def lead_activity(request, lead_id):

    lead = get_object_or_404(Lead, pk=lead_id)

    # ✅ GET
    if request.method == "GET":
        activities = get_all_activities(lead)
        return Response(activities)

    # ✅ POST
    if request.method == "POST":

        activity_type = request.data.get("type", "").lower()

        data = request.data.copy()
        data["lead"] = lead_id

        attendees = data.get("attendees", [])

        if isinstance(attendees, str):
            attendees = [a.strip() for a in attendees.split(",") if a.strip()]

        if attendees:
            data["organized_by"] = attendees[0].split(" ")[0]
        else:
            data["organized_by"] = "Unknown"

        serializer_map = {
            "task": TaskSerializer,
            "note": NoteSerializer,
            "call": CallSerializer,
            "meeting": MeetingSerializer,
            "email": EmailSerializer,
        }

        serializer_class = serializer_map.get(activity_type)

        if not serializer_class:
            return Response({"error": "Invalid type"}, status=400)

        serializer = serializer_class(data=data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=400)

        instance = serializer.save()

        return Response(serializer.data, status=201)


@api_view(["DELETE"])
def delete_activity(request, pk):

    activity_type = request.query_params.get("type", "").lower()

    try:
        if activity_type == "task":
            obj = Task.objects.get(pk=pk)

        elif activity_type == "note":
            obj = Note.objects.get(pk=pk)

        elif activity_type == "call":
            obj = Call.objects.get(pk=pk)

        elif activity_type == "meeting":
            obj = Meeting.objects.get(pk=pk)

        elif activity_type == "email":
            obj = Email.objects.get(pk=pk)

        else:
            return Response({"error": "Invalid type"}, status=400)

        obj.delete()
        return Response({"message": "Deleted"}, status=204)

    except ObjectDoesNotExist:
        return Response({"error": "Not found"}, status=404)


@api_view(["PUT"])
def update_activity(request, pk):

    activity_type = request.data.get("type", "").lower()

    try:
        if activity_type == "task":
            obj = Task.objects.get(pk=pk)
            serializer = TaskSerializer(obj, data=request.data, partial=True)

        elif activity_type == "note":
            obj = Note.objects.get(pk=pk)
            serializer = NoteSerializer(obj, data=request.data, partial=True)

        elif activity_type == "call":
            obj = Call.objects.get(pk=pk)
            serializer = CallSerializer(obj, data=request.data, partial=True)

        elif activity_type == "meeting":
            obj = Meeting.objects.get(pk=pk)

            payload = request.data.copy()

            meeting_details = payload.get("meeting_details", {})

            if meeting_details:
                payload["organized_by"] = meeting_details.get("organized_by")
                payload["date"] = meeting_details.get("date")
                payload["start_time"] = meeting_details.get("startTime")
                payload["end_time"] = meeting_details.get("endTime")
                payload["attendees"] = meeting_details.get("attendees", [])
                payload["description"] = meeting_details.get("description")
                payload["outcome"] = meeting_details.get("outcome")

            serializer = MeetingSerializer(obj, data=payload, partial=True)

        elif activity_type == "email":
            obj = Email.objects.get(pk=pk)
            serializer = EmailSerializer(obj, data=request.data, partial=True)

        else:
            return Response({"error": "Invalid type"}, status=400)

        if serializer.is_valid():
            serializer.save()
            # return Response(serializer.data)
            return Response(
                {
                    "id": obj.id,
                    "type": activity_type,
                    "content": getattr(obj, "content", None),
                    "notes": getattr(obj, "notes", None),
                    "title": getattr(obj, "title", None),
                    "subject": getattr(obj, "subject", None),
                    "body": getattr(obj, "body", None),
                    "status": getattr(obj, "status", None),
                    "due_date": getattr(obj, "dueDate", None),
                    "call_time": getattr(obj, "callTime", None),
                    "meeting_time": getattr(obj, "meetingTime", None),
                    "location": getattr(obj, "location", None),
                    "created_at": getattr(obj, "createdAt", None),
                    "description": getattr(obj, "description", None),
                    "connected": getattr(obj, "connected", None),
                    "outcome": getattr(obj, "outcome", None),
                    "attendees": getattr(obj, "attendees", []),
                    "organized_by": getattr(obj, "organized_by", ""),
                    "date": getattr(obj, "date", None),
                    "start_time": getattr(obj, "start_time", None),
                    "end_time": getattr(obj, "end_time", None),
                    "to_email": getattr(obj, "to_email", None),
                    "sent_at": getattr(obj, "sentAt", None),
                    "cc": getattr(obj, "cc", []),
                    "bcc": getattr(obj, "bcc", []),
                   "meeting_details": {
    "date": getattr(obj, "date", None),
    "startTime": getattr(obj, "start_time", None),
    "endTime": getattr(obj, "end_time", None),
    "attendees": getattr(obj, "attendees", []),
    "organized_by": getattr(obj, "organized_by", ""),
    "description": getattr(obj, "description", None),
    "outcome": getattr(obj, "outcome", None),
},
                }
            )

        return Response(serializer.errors, status=400)

    except ObjectDoesNotExist:
        return Response({"error": "Not found"}, status=404)


# ============== ATTACHMENT =================


@api_view(["POST", "GET"])
def upload_attachment(request, lead_id):

    lead = get_object_or_404(Lead, pk=lead_id)

    if request.method == "GET":
        attachments = lead.attachments.all()
        serializer = AttachmentSerializer(
            attachments, many=True, context={"request": request}
        )
        return Response(serializer.data)

    if request.method == "POST":
        file = request.FILES.get("file")

        if not file:
            return Response({"error": "No file uploaded"}, status=400)

        attachment = Attachment.objects.create(lead=lead, file=file)

        serializer = AttachmentSerializer(attachment, context={"request": request})
        return Response(serializer.data, status=201)


@api_view(["DELETE"])
def delete_attachment(request, pk):
    attachment = get_object_or_404(Attachment, pk=pk)
    attachment.file.delete(save=False)

    attachment.delete()
    return Response(
        {"message": "Attachment deleted"}, status=status.HTTP_204_NO_CONTENT
    )


@api_view(["POST"])
def convert_lead(request, pk):

    lead = get_object_or_404(Lead, pk=pk)

    if lead.leadStatus == "Converted":
        return Response({"message": "Already converted"}, status=400)

    deal = convert_lead_to_deal(lead, request.data)

    return Response({"message": "Lead converted successfully", "deal_id": deal.id})


from django.core.mail import send_mail
from django.conf import settings
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(["POST"])
def send_lead_email(request, lead_id):
    lead = get_object_or_404(Lead, pk=lead_id)

    subject = request.data.get("subject")
    body = request.data.get("body")
    to_email = request.data.get("to_email", lead.email)

    if not subject or not body:
        return Response({"error": "Subject & body required"}, status=400)

    cc = request.data.get("cc", [])
    bcc = request.data.get("bcc", [])

    if isinstance(cc, str):
        cc = [x.strip() for x in cc.split(",") if x.strip()]

    if isinstance(bcc, str):
        bcc = [x.strip() for x in bcc.split(",") if x.strip()]

    # ✅ create DB email FIRST
    email_obj = Email.objects.create(
        lead=lead,
        subject=subject,
        body=body,
        to_email=to_email,
        cc=cc,
        bcc=bcc,
        sentAt=timezone.now(),
    )

    email = EmailMessage(
        subject=subject,
        body=body,
        from_email=settings.EMAIL_HOST_USER,  # ✅ FIX (important)
        to=[to_email],
        cc=cc,
        bcc=bcc,
    )

    email.content_subtype = "html"

    # ✅ Attachments
    files = request.FILES.getlist("attachments")

    for file in files:
        email.attach(file.name, file.read(), file.content_type)

        Attachment.objects.create(lead=lead, email=email_obj, file=file)

    try:
        email.send()
    except Exception as e:
        return Response({"error": str(e)}, status=500)

    return Response(EmailSerializer(email_obj).data, status=201)