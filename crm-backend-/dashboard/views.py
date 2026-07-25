from django.shortcuts import render

# Create your views here.
from django.db.models import Count, Sum
from django.db.models.functions import  TruncDay, TruncWeek, TruncMonth, TruncYear
from django.http import HttpResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Lead, Deal, Employee
import csv
from deals.models import Deal as PipelineDeal  
from django.db.models import Count
from deals.models import Deal   

from leads.models import Lead
from deals.models import Deal
from django.db.models import Sum


@api_view(['GET'])
def dashboard_summary(request):

    total_leads = Lead.objects.count()

    active_deals = Deal.objects.filter(
        deal_stage__in=["Proposal", "Negotiation"]
    ).count()

    closed_deals = Deal.objects.filter(
        deal_stage__in=["Closed Won"]
    ).count()

    revenue = Deal.objects.filter(
        deal_stage="Closed Won"
    ).aggregate(total=Sum('amount'))['total'] or 0

    return Response({
        "total_leads": total_leads,
        "active_deals": active_deals,
        "closed_deals": closed_deals,
        "monthly_revenue": revenue
    })

    

@api_view(['GET'])
def sales_report(request):
    from deals.models import Deal
    from django.db.models.functions import TruncMonth
    from django.db.models import Sum

    data = (
        Deal.objects
        .filter(deal_stage="Closed Won")  # 👈 ONLY WON DEALS
        .annotate(month=TruncMonth('close_date'))  # 👈 group by month
        .values('month')
        .annotate(total_revenue=Sum('amount'))
        .order_by('month')
    )

    result = []
    for item in data:
        result.append({
            "month": item["month"].strftime("%Y-%m"),
            "revenue": item["total_revenue"] or 0
        })

    return Response(result)


@api_view(['GET'])
def conversion_funnel(request):

    stages = [
        "Contact",
        "Qualified",
        "Proposal",
        "Negotiation",
        "Closed Won",
        "Closed Lost",
    ]

    result = {stage: 0 for stage in stages}

    # ✅ CONTACT → FROM LEADS
    result["Contact"] = Lead.objects.filter(
        leadStatus="Contacted"
    ).count()


    # ✅ DEAL STAGES
    deal_data = (
        Deal.objects
        .values("deal_stage")
        .annotate(count=Count("id"))
    )

    for item in deal_data:
        stage = item["deal_stage"]

        if stage == "Contact":
            continue

        if stage in result:
            result[stage] = item["count"]

    return Response(result)



@api_view(['GET'])
def team_performance(request):
    employees = Employee.objects.all()
    result = []

    for emp in employees:
        active = Deal.objects.filter(employee=emp, status='active').count()
        closed = Deal.objects.filter(employee=emp, status='closed').count()
        revenue = Deal.objects.filter(employee=emp, closed_won=True).aggregate(total=Sum('value'))['total'] or 0

        result.append({
            "employee": emp.name,
            "active_deals": active,
            "closed_deals": closed,
            "revenue": revenue
        })

    return Response(result)

@api_view(['GET'])
def export_team_performance_csv(request):
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="team_performance.csv"'

    writer = csv.writer(response)

    writer.writerow(['Employee', 'Active Deals', 'Closed Deals', 'Revenue'])

    employees = Employee.objects.all()

    for emp in employees:
        active = Deal.objects.filter(employee=emp, status='active').count()
        closed = Deal.objects.filter(employee=emp, status='closed').count()
        revenue = Deal.objects.filter(employee=emp, closed_won=True)\
            .aggregate(total=Sum('value'))['total'] or 0

        writer.writerow([
            emp.name,
            active,
            closed,
            revenue
        ])

    return response