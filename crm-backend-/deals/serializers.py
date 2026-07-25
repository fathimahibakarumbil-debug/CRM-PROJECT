from rest_framework import serializers
from .models import Deal, DealActivity, DealAttachment, Email




class DealSerializer(serializers.ModelSerializer):

    lead_status = serializers.CharField(source="lead.leadStatus", read_only=True)
    lead_name = serializers.SerializerMethodField()
    lead_email = serializers.CharField(source="lead.email", read_only=True)
    lead_phone = serializers.CharField(source="lead.phone", read_only=True)

    email = serializers.SerializerMethodField()

    class Meta:
        model = Deal
        fields = "__all__"
        extra_kwargs = {"ai_summary": {"required": False}}

    def get_email(self, obj):
        # ✅ SAFE FALLBACK LOGIC
        if obj.email and obj.email.strip():
            return obj.email

        if obj.lead and obj.lead.email:
            return obj.lead.email

        return ""

    def get_lead_name(self, obj):
        if obj.lead:
            return f"{obj.lead.firstName} {obj.lead.lastName}"
        return ""

class DealActivitySerializer(serializers.ModelSerializer):
    meeting_details = serializers.SerializerMethodField()

    subject = serializers.CharField(source="title", read_only=True)
    body = serializers.CharField(source="description", read_only=True)
    to_email = serializers.CharField(source="recipient", read_only=True)

    class Meta:
        model = DealActivity
        fields = "__all__"
        

    def get_meeting_details(self, obj):
        if str(obj.type).lower() == "meeting":
            if hasattr(obj, "meeting_details"):
                m = obj.meeting_details
                return {
                    "startTime": m.start_time,
                    "endTime": m.end_time,
                    "attendees": m.attendees,
                    "organized_by": m.organized_by,
                    "date": m.date,
                }
        return None


class DealAttachmentSerializer(serializers.ModelSerializer):
    file = serializers.SerializerMethodField()

    class Meta:
        model = DealAttachment
        fields = ["id", "deal", "file", "uploaded_at"]

    def get_file(self, obj):
        if not obj.file:
            return None

        request = self.context.get("request")

        if request:
            return request.build_absolute_uri(obj.file.url)

        return obj.file.url