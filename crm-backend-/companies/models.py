from django.db import models

# Create your models here.
from django.db import models

# ================== COMPANY ==================

class Company(models.Model):
    companyName = models.CharField(max_length=255)
    companyOwner = models.CharField(max_length=255, blank=True, null=True)
    phoneNumber = models.CharField(max_length=20, blank=True, null=True)
    industry = models.CharField(max_length=100, blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    countryRegion = models.CharField(max_length=100, blank=True, null=True)
    domainName = models.CharField(max_length=255, blank=True, null=True)
    type = models.CharField(max_length=50, blank=True, null=True)
    noOfEmployees = models.IntegerField(blank=True, null=True)
    annualRevenue = models.CharField(max_length=100, blank=True, null=True)
    createdDate = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.companyName


# ================== ACTIVITY ==================

class CompanyTask(models.Model):
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='tasks')
    title = models.CharField(max_length=255)
    dueDate = models.DateField()
    status = models.CharField(max_length=50, default="pending")
    createdAt = models.DateTimeField(auto_now_add=True)


class CompanyNote(models.Model):
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='notes')
    description = models.TextField()
    createdAt = models.DateTimeField(auto_now_add=True)


class CompanyCall(models.Model):
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='calls')
    callTime = models.DateTimeField()
    notes = models.TextField(blank=True, null=True)
    createdAt = models.DateTimeField(auto_now_add=True)


class CompanyMeeting(models.Model):
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='meetings')
    meetingTime = models.DateTimeField()
    location = models.CharField(max_length=255)
    status = models.CharField(max_length=50, default="scheduled")
    meetingLink = models.URLField(blank=True, null=True)
    notes = models.TextField(blank=True, null=True)
    createdAt = models.DateTimeField(auto_now_add=True)


class CompanyEmail(models.Model):
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='emails')
    subject = models.CharField(max_length=255)
    body = models.TextField()
    to_email = models.EmailField()
    sentAt = models.DateTimeField()
    createdAt = models.DateTimeField(auto_now_add=True)



class CompanyAttachment(models.Model):
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='attachments')
    file = models.FileField(upload_to='company_attachments/')
    uploadedAt = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.file.name