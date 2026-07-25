from django.shortcuts import render

# Create your views here.
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

from .models import Deal, DealActivity, DealAttachment
from .serializers import *
from .serializers import DealSerializer
from django.core.mail import send_mail
from django.conf import settings
from .models import Meeting, Email
from django.utils.html import strip_tags
from leads.models import Lead

# ================= DEAL =================


@api_view(["GET", "POST"])
def deal_list_create(request):
    if request.method == "GET":
        deals = Deal.objects.select_related("lead").all().order_by("-created_at")
        return Response(DealSerializer(deals, many=True).data)

    if request.method == "POST":
        data = request.data.copy()

        lead_id = data.get("lead")

        if lead_id:
            try:
                lead = Lead.objects.get(id=lead_id)

                # 👇 AUTO EMAIL COPY
                data["email"] = lead.email
                data["phone"] = lead.phone

            except Lead.DoesNotExist:
                pass

        serializer = DealSerializer(data=data)

        if serializer.is_valid():
            deal = serializer.save()

            if deal.lead:
                deal.lead.leadStatus = "Converted"
                deal.lead.save()

            return Response(serializer.data, status=201)

        return Response(serializer.errors, status=400)
    print("deal ready")


@api_view(["GET"])
def deal_detail(request, id):
    try:
        deal = Deal.objects.select_related("lead").get(id=id)
    except Deal.DoesNotExist:
        return Response({"error": "Not found"}, status=404)

    return Response(
        {
            **DealSerializer(deal).data,
            "activities": DealActivitySerializer(deal.activities.all(), many=True).data,
            "attachments": DealAttachmentSerializer(
                deal.attachments.all(),
                many=True,
                context={"request": request},
            ).data,
            "emails": [
                {
                    "id": email.id,
                    "title": email.subject,
                    "description": email.body,
                    "recipient": email.to_email,
                    "subject": email.subject,
                    "body": email.body,
                    "to_email": email.to_email,
                    "sentAt": email.sentAt.isoformat(),
                    "type": "email",
                }
                for email in deal.emails.all().order_by("-sentAt")
            ],
        }
    )


@api_view(["PUT"])
def update_deal(request, pk):
    deal = get_object_or_404(Deal, pk=pk)
    serializer = DealSerializer(deal, data=request.data, partial=True)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)

    return Response(serializer.errors, status=400)


@api_view(["DELETE"])
def delete_deal(request, pk):
    deal = get_object_or_404(Deal, pk=pk)
    deal.delete()
    return Response({"message": "Deleted"})


# ================= ACTIVITY =================


@api_view(["POST"])
def add_activity(request, deal_id):
    data = request.data.copy()
    data["deal"] = deal_id
    if "type" in data:
        data["type"] = str(data["type"]).capitalize()

    activity_type = str(data.get("type", "")).lower()

    if activity_type == "email":
        data["title"] = data.get("subject") or data.get("title") or "No Subject"
        data["description"] = strip_tags(
            data.get("description") or data.get("body") or ""
        )
        data["recipient"] = data.get("recipient") or data.get("to_email")

    serializer = DealActivitySerializer(data=data)

    if not serializer.is_valid():
        return Response(serializer.errors, status=400)

    activity = serializer.save()

    # EMAIL SEND + SAVE

    if activity_type == "email":
        subject = data.get("title") or data.get("subject") or "No Subject"
        message = strip_tags(data.get("description") or data.get("body") or "")
        recipient = (
            data.get("recipient")
            or data.get("to_email")
            or activity.deal.email
            or (activity.deal.lead.email if activity.deal.lead else None)
        )

        if recipient:
            try:
                send_mail(
                    subject,
                    message,
                    settings.EMAIL_HOST_USER,
                    [recipient],
                    fail_silently=False,
                )

            except Exception as e:
                return Response({"error": str(e)}, status=500)

    # MEETING SAVE
    if activity_type == "meeting":
        attendees = data.get("attendees", [])

        Meeting.objects.create(
            activity=activity,
            organized_by=attendees[0] if attendees else "",
            date=data.get("date"),
            start_time=data.get("startTime"),
            end_time=data.get("endTime"),
            attendees=attendees,
        )

        activity.refresh_from_db()

    return Response(DealActivitySerializer(activity).data)


@api_view(["PUT"])
def update_activity(request, pk):
    activity = get_object_or_404(DealActivity, pk=pk)

    serializer = DealActivitySerializer(activity, data=request.data, partial=True)

    if serializer.is_valid():
        serializer.save()

        activity_type = str(request.data.get("type", "")).lower()

        if activity_type == "meeting":
            attendees = request.data.get("attendees", [])

            meeting_obj, created = Meeting.objects.get_or_create(activity=activity)

            meeting_obj.organized_by = request.data.get("organized_by", "")
            meeting_obj.date = request.data.get("date")
            meeting_obj.start_time = request.data.get("startTime")
            meeting_obj.end_time = request.data.get("endTime")
            meeting_obj.attendees = attendees
            meeting_obj.save()

        activity.refresh_from_db()

        return Response(DealActivitySerializer(activity).data)

    return Response(serializer.errors)


@api_view(["DELETE"])
def delete_activity(request, pk):
    activity = get_object_or_404(DealActivity, pk=pk)

    if str(activity.type).lower() == "email":
        Email.objects.filter(
            deal=activity.deal,
            subject=activity.title,
            to_email=activity.recipient,
        ).delete()

    activity.delete()

    return Response({"message": "Deleted"})


# ================= ATTACHMENT =================


@api_view(["POST"])
def upload_attachment(request, deal_id):
    deal = get_object_or_404(Deal, pk=deal_id)

    uploaded_file = request.FILES.get("file")

    if not uploaded_file:
        return Response({"error": "No file uploaded"}, status=400)

    attachment = DealAttachment.objects.create(
        deal=deal,
        file=uploaded_file,
    )

    response_serializer = DealAttachmentSerializer(
        attachment,
        context={"request": request},
    )

    return Response(response_serializer.data, status=201)


@api_view(["DELETE"])
def delete_attachment(request, pk):
    attachment = get_object_or_404(DealAttachment, pk=pk)

    if attachment.file:
        attachment.file.delete(save=False)

    attachment.delete()

    return Response({"message": "Deleted"})


@api_view(["DELETE"])
def delete_email(request, pk):
    email = get_object_or_404(Email, pk=pk)
    email.delete()
    return Response({"message": "Email deleted"})