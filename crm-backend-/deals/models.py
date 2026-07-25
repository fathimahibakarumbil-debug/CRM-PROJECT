from django.db import models

# Create your models here.
from django.db import models
from leads.models import Lead  # 👈 import (app name adjust ചെയ്യുക)
from django.utils import timezone


# =====================================================
# DEAL MODEL
# =====================================================
class Deal(models.Model):

    STAGE_CHOICES = [
        ("Contact", "Contact"),
        ("Qualified", "Qualified"),
        ("Proposal", "Proposal"),
        ("Negotiation", "Negotiation"),
        ("Closed Won", "Closed Won"),
        ("Closed Lost", "Closed Lost"),
    ]

    deal_name = models.CharField(max_length=255)
    # deal_owner = models.CharField(max_length=100)
    deal_owner = models.JSONField(default=list, blank=True)
    deal_stage = models.CharField(
        max_length=50, choices=STAGE_CHOICES, default="Contact"
    )

    amount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)

    close_date = models.DateField(null=True, blank=True)

    priority = models.CharField(max_length=20, default="Medium")

    # ai_summary = models.TextField(blank=True)
    ai_summary = models.TextField(blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    phone = models.CharField(max_length=20, null=True, blank=True)

    lead = models.ForeignKey(
        Lead,
        on_delete=models.CASCADE,
        related_name="deals",
        null=True,  # temp (migration easy)
        blank=True,
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.deal_name


# =====================================================
# DEAL ACTIVITIES
# =====================================================


class DealActivity(models.Model):

    ACTIVITY_TYPES = [
        ("Note", "Note"),
        ("Call", "Call"),
        ("Task", "Task"),
        ("Meeting", "Meeting"),
        ("Email", "Email"),
    ]

    deal = models.ForeignKey(Deal, on_delete=models.CASCADE, related_name="activities")

    type = models.CharField(max_length=20, choices=ACTIVITY_TYPES)

    title = models.CharField(max_length=255, blank=True)
    description = models.TextField(blank=True)
    recipient = models.EmailField(blank=True)

    connected = models.CharField(max_length=255, blank=True)
    outcome = models.CharField(max_length=50, blank=True)
    call_time = models.DateTimeField(null=True, blank=True)
    due_date = models.DateField(null=True, blank=True)
    due_time = models.TimeField(null=True, blank=True)
    priority = models.CharField(max_length=20, blank=True)
    status = models.CharField(max_length=50, blank=True)
    assigned_to = models.CharField(max_length=100, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.type} - {self.deal.deal_name}"


class Meeting(models.Model):
    activity = models.OneToOneField(
        DealActivity, on_delete=models.CASCADE, related_name="meeting_details"
    )

    organized_by = models.CharField(max_length=100)
    date = models.DateTimeField(null=True, blank=True)
    start_time = models.CharField(max_length=10, null=True, blank=True)
    end_time = models.CharField(max_length=10, null=True, blank=True)

    attendees = models.JSONField(default=list, blank=True)


class Call(models.Model):
    activity = models.OneToOneField(
        DealActivity, on_delete=models.CASCADE, related_name="call_details"
    )
    call_duration = models.IntegerField(null=True, blank=True)  # seconds


class Email(models.Model):
    deal = models.ForeignKey(
        Deal,
        on_delete=models.CASCADE,
        related_name="emails",
        null=True,
        blank=True,
    )

    subject = models.CharField(max_length=255)
    body = models.TextField()
    to_email = models.EmailField()
    sentAt = models.DateTimeField(default=timezone.now)
    createdAt = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Email: {self.subject}"


# # =====================================================
# DEAL ATTACHMENTS
# =====================================================
class DealAttachment(models.Model):

    deal = models.ForeignKey(Deal, on_delete=models.CASCADE, related_name="attachments")

    file = models.FileField(upload_to="deal_attachments/")

    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.file.name