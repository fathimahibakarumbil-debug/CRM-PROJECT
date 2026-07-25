from django.urls import path
from . import views

urlpatterns = [
    path('summary/', views.dashboard_summary),
    path('sales/', views.sales_report),
    path('conversion/', views.conversion_funnel),
    path('team/', views.team_performance),
    path('team/export-csv/', views.export_team_performance_csv),
]