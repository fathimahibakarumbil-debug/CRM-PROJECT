from django.db import models

# Create your models here.
from django.db import models
from django.contrib.auth.models import User
from django.contrib.postgres.fields import ArrayField
from django.utils import timezone


class Lead(models.Model):
    STATUS_CHOICES = [
        ("New", "New"),
        ("Open", "Open "),
        ("Contacted", "Contacted"),
        ("In Progress", "In Progress"),
        ("Qualified", "Qualified"),
        ("Lost", "Lost"),
        ("Converted", "Converted"),
    ]

    firstName = models.CharField(max_length=100)
    lastName = models.CharField(max_length=100, blank=True)
    email = models.EmailField()
    phone = models.CharField(max_length=20)

    city = models.CharField(max_length=100, blank=True)
    company = models.CharField(max_length=150, blank=True)
    jobTitle = models.CharField(max_length=100, blank=True)

    source = models.CharField(max_length=100, blank=True)
    contactOwner = ArrayField(
        models.CharField(max_length=100), blank=True, default=list
    )
    priority = models.CharField(max_length=20, default="medium")
    value = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)

    leadStatus = models.CharField(max_length=20, choices=STATUS_CHOICES, default="New")
    aiSummary = models.TextField(blank=True)

    createdDate = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.firstName} {self.lastName}"


class Task(models.Model):
    lead = models.ForeignKey(Lead, on_delete=models.CASCADE, related_name="tasks")

    title = models.CharField(max_length=255)

    dueDate = models.DateField(null=True, blank=True)
    due_time = models.TimeField(null=True, blank=True)

    status = models.CharField(max_length=50, default="Open")
    priority = models.CharField(max_length=20, blank=True, default="")
    assigned_to = models.CharField(max_length=100, blank=True, default="")

    description = models.TextField(blank=True, default="")

    createdAt = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} - {self.lead.firstName}"


class Note(models.Model):
    lead = models.ForeignKey(Lead, on_delete=models.CASCADE, related_name="notes")
    content = models.TextField()
    createdAt = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Note for {self.lead.firstName}"


class Call(models.Model):
    lead = models.ForeignKey(Lead, on_delete=models.CASCADE, related_name="calls")

    connected = models.CharField(max_length=255, blank=True, default="")
    outcome = models.CharField(max_length=255, blank=True, default="")

    callTime = models.DateTimeField()
    description = models.TextField(blank=True, null=True)

    createdAt = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Call with {self.lead.firstName} at {self.callTime}"


class Meeting(models.Model):
    lead = models.ForeignKey(Lead, on_delete=models.CASCADE, related_name="meetings")

    title = models.CharField(max_length=255, blank=True, default="")
    description = models.TextField(blank=True, null=True)
    outcome = models.TextField(blank=True, null=True)

    organized_by = models.CharField(max_length=255, blank=True, default="")
    attendees = ArrayField(models.CharField(max_length=100), default=list, blank=True)

    date = models.DateTimeField(null=True, blank=True)
    start_time = models.CharField(max_length=10, null=True, blank=True)
    end_time = models.CharField(max_length=10, null=True, blank=True)

    location = models.CharField(max_length=255, blank=True, default="")

    createdAt = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Meeting with {self.lead.firstName}"


class Email(models.Model):
    lead = models.ForeignKey(Lead, on_delete=models.CASCADE, related_name="emails")
    subject = models.CharField(max_length=255)
    body = models.TextField()
    to_email = models.EmailField()
    sentAt = models.DateTimeField(default=timezone.now)
    createdAt = models.DateTimeField(auto_now_add=True)
    cc = ArrayField(models.EmailField(), blank=True, default=list)
    bcc = ArrayField(models.EmailField(), blank=True, default=list)

    def __str__(self):
        return f"Email: {self.subject}"


class Attachment(models.Model):
    lead = models.ForeignKey(Lead, on_delete=models.CASCADE, related_name="attachments")
    email = models.ForeignKey(
        Email,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="attachments",
    )
    file = models.FileField(upload_to="attachments/")
    uploadedAt = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.file.name