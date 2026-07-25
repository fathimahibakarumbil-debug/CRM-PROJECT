from django.shortcuts import render

# Create your views here.
from django.http import JsonResponse
from django.db.models import Q

from leads.models import Lead
from deals.models import Deal
from tickets.models import Ticket
from companies.models import Company


def global_search(request):
    query = request.GET.get("search", "").strip()

    if not query:
        return JsonResponse({
            "leads": [],
            "companies": [],
            "deals": [],
            "tickets": []
        })

    # 🔥 SPLIT WORDS (better search)
    words = query.split()

    lead_filter = Q()
    company_filter = Q()
    deal_filter = Q()
    ticket_filter = Q()

    for word in words:
        # LEAD 🔥
        lead_filter |= (
            Q(firstName__icontains=word) |
            Q(lastName__icontains=word) |
            Q(email__icontains=word) |
            Q(phone__icontains=word) |
            Q(company__icontains=word) |  
            Q(city__icontains=word)      
        )

        # COMPANY 🔥
        company_filter |= (
            Q(companyName__icontains=word) |
            Q(city__icontains=word) |
            Q(industry__icontains=word)
        )

        # DEAL 🔥
        deal_filter |= (
            Q(deal_name__icontains=word) |
            Q(deal_owner__icontains=word) |
            Q(deal_stage__icontains=word)
        )

        # TICKET 🔥
        ticket_filter |= (
            Q(ticket_name__icontains=word) |
            Q(ticket_owner__icontains=word) |
            Q(ticket_status__icontains=word)
        )

    leads = list(
    Lead.objects.filter(lead_filter)
    .values("id", "firstName", "lastName", "leadStatus")[:5]  
)

    companies = list(
        Company.objects.filter(company_filter)
        .values("id", "companyName", "industry")[:5] 
    )

    deals = list(
        Deal.objects.filter(deal_filter)
        .values("id", "deal_name", "deal_stage")[:5] 
    )

    tickets = list(
        Ticket.objects.filter(ticket_filter)
        .values("id", "ticket_name", "ticket_status")[:5]  
    )

    return JsonResponse({
        "leads": leads,
        "companies": companies,
        "deals": deals,
        "tickets": tickets
    })

#----------------------------Notification--------------------------


# # views.py

# from rest_framework.decorators import api_view
# from rest_framework.response import Response
# from .models import Notification
# from .serializers import NotificationSerializer


# @api_view(['GET'])
# def get_notifications(request):
#     notifications = Notification.objects.all().order_by('-created_at')
#     serializer = NotificationSerializer(notifications, many=True)
#     return Response(serializer.data)


# @api_view(['PATCH'])
# def mark_notification_read(request, id):
#     notif = Notification.objects.get(id=id)
#     notif.is_read = True
#     notif.save()
#     return Response({"message": "Marked as read"})