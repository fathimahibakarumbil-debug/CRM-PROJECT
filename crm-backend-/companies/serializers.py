from rest_framework import serializers
from .models import *

class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = '__all__'


class CompanyTaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompanyTask
        fields = '__all__'


class CompanyNoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompanyNote
        fields = '__all__'


class CompanyCallSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompanyCall
        fields = '__all__'


class CompanyMeetingSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompanyMeeting
        fields = '__all__'


class CompanyEmailSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompanyEmail
        fields = '__all__'


class CompanyAttachmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompanyAttachment
        fields = '__all__'