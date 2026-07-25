from django.db import models

# Create your models here.
from django.db import models

class Ticket(models.Model):

    STATUS_CHOICES = [
        ('New', 'New'),
        ('Waiting on contact', 'Waiting on contact'),
        ('Waiting on us', 'Waiting on us'),
        ('Closed', 'Closed'),
    ]

    

    PRIORITY_CHOICES = [
        ('Low', 'Low'),
        ('Medium', 'Medium'),
        ('High', 'High'),
        ('Critical', 'Critical'),
    ]

    SOURCE_CHOICES = [
        ('Chat', 'Chat'),
        ('Email', 'Email'),
        ('Phone', 'Phone'),
    ]

    ticket_name = models.CharField(max_length=255)
    ticket_status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='New')
    priority = models.CharField(max_length=50, choices=PRIORITY_CHOICES, null=True, blank=True)
    source = models.CharField(max_length=50, choices=SOURCE_CHOICES, null=True, blank=True)
    ticket_owner = models.CharField(max_length=100, null=True, blank=True)
    description = models.TextField(null=True,blank=True)
    created_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.ticket_name