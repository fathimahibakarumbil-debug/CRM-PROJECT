from rest_framework import serializers
from .models import Lead, Task, Note, Call, Meeting, Email, Attachment


# ✅ TASK
class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = "__all__"


# ✅ NOTE
class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = "__all__"


# ✅ CALL
class CallSerializer(serializers.ModelSerializer):
    class Meta:
        model = Call
        fields = "__all__"


# ✅ MEETING


class MeetingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Meeting
        fields = "__all__"

    def to_internal_value(self, data):
        data = data.copy()

        # map camelCase → snake_case
        if "startTime" in data and "start_time" not in data:
            data["start_time"] = data["startTime"]

        if "endTime" in data and "end_time" not in data:
            data["end_time"] = data["endTime"]

        return super().to_internal_value(data)

    def to_representation(self, instance):
        data = super().to_representation(instance)

        data["meeting_details"] = {
            "date": instance.date,
            "startTime": instance.start_time,
            "endTime": instance.end_time,
            "attendees": instance.attendees,
            "organized_by": instance.organized_by,
        }

        data["description"] = instance.description
        data["outcome"] = instance.outcome

        return data

    def update(self, instance, validated_data):
        instance.organized_by = validated_data.get(
            "organized_by", instance.organized_by
        )
        instance.date = validated_data.get("date", instance.date)
        instance.start_time = validated_data.get("start_time", instance.start_time)
        instance.end_time = validated_data.get("end_time", instance.end_time)
        instance.attendees = validated_data.get("attendees", instance.attendees)
        instance.description = validated_data.get("description", instance.description)
        instance.outcome = validated_data.get("outcome", instance.outcome)

        instance.save()
        return instance


# ✅ EMAIL
# class EmailSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Email
#         fields = "__all__"

from django.utils import timezone

# class EmailSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Email
#         fields = "__all__"

#     def create(self, validated_data):
#         lead = validated_data.get("lead")

#         if not validated_data.get("to_email") and lead:
#             validated_data["to_email"] = lead.email

#         if not validated_data.get("sentAt"):
#             validated_data["sentAt"] = timezone.now()


#         return super().create(validated_data)
class EmailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Email
        fields = "__all__"
        extra_kwargs = {"to_email": {"required": False}}

    def create(self, validated_data):
        lead = validated_data.get("lead")

        if not validated_data.get("to_email") and lead:
            validated_data["to_email"] = lead.email

        return super().create(validated_data)


from django.conf import settings


class AttachmentSerializer(serializers.ModelSerializer):
    file = serializers.SerializerMethodField()

    class Meta:
        model = Attachment
        fields = ["id", "file", "uploadedAt"]

    def get_file(self, obj):
        request = self.context.get("request")
        if obj.file:
            url = obj.file.url
            if request:
                return request.build_absolute_uri(url)
            return url
        return None


class LeadSerializer(serializers.ModelSerializer):

    tasks = TaskSerializer(many=True, read_only=True)
    notes = NoteSerializer(many=True, read_only=True)
    calls = CallSerializer(many=True, read_only=True)
    meetings = MeetingSerializer(many=True, read_only=True)
    emails = EmailSerializer(many=True, read_only=True)
    attachments = AttachmentSerializer(many=True, read_only=True)

    class Meta:
        model = Lead
        fields = "__all__"