from django.shortcuts import render

# Create your views here.
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.db.models import Q
from django.core.mail import send_mail


from .models import *
from .serializers import *

# ================== COMPANY ==================

@api_view(['GET', 'POST'])
def company_list_create(request):

    if request.method == 'GET':
        companies = Company.objects.all().order_by('-createdDate')

        search = request.GET.get('search')
        if search:
            companies = companies.filter(
                Q(companyName__icontains=search) |
                Q(companyOwner__icontains=search) |
                Q(city__icontains=search) |
                Q(countryRegion__icontains=search)
            )

        return Response(CompanySerializer(companies, many=True).data)

    if request.method == 'POST':
        serializer = CompanySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)


# ================== DETAIL ==================

@api_view(['GET', 'PUT', 'DELETE'])
def company_detail(request, pk):

    company = get_object_or_404(Company, pk=pk)

    # ✅ GET (LIKE LEAD)
    if request.method == 'GET':
        return Response({
            "company": CompanySerializer(company).data,
            "tasks": CompanyTaskSerializer(company.tasks.all(), many=True).data,
            "notes": CompanyNoteSerializer(company.notes.all(), many=True).data,
            "calls": CompanyCallSerializer(company.calls.all(), many=True).data,
            "meetings": CompanyMeetingSerializer(company.meetings.all(), many=True).data,
            "emails": CompanyEmailSerializer(company.emails.all(), many=True).data,
            "attachments": CompanyAttachmentSerializer(company.attachments.all(), many=True).data,
        })

    if request.method == 'PUT':
        serializer = CompanySerializer(company, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=400)

    if request.method == 'DELETE':
        company.delete()
        return Response({"message": "Deleted"}, status=204)


# ================== COMMON FILTER ==================

def get_filtered_queryset(model, request):
    company_id = request.GET.get('company_id')

    if company_id:
        return model.objects.filter(company_id=company_id)

    return model.objects.all()


# ================== TASK ==================

@api_view(['GET', 'POST'])
def company_task_list_create(request):
    if request.method == 'GET':
        tasks = get_filtered_queryset(CompanyTask, request)
        return Response(CompanyTaskSerializer(tasks, many=True).data)

    if request.method == 'POST':
        serializer = CompanyTaskSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)

        return Response(serializer.errors, status=400)


# ================== NOTE ==================

@api_view(['GET', 'POST'])
def company_note_list_create(request):
    if request.method == 'GET':
        notes = get_filtered_queryset(CompanyNote, request)
        return Response(CompanyNoteSerializer(notes, many=True).data)

    if request.method == 'POST':
        serializer = CompanyNoteSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)

        return Response(serializer.errors, status=400)


# ================== CALL ==================

@api_view(['GET', 'POST'])
def company_call_list_create(request):
    if request.method == 'GET':
        calls = get_filtered_queryset(CompanyCall, request)
        return Response(CompanyCallSerializer(calls, many=True).data)

    if request.method == 'POST':
        serializer = CompanyCallSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)

        return Response(serializer.errors, status=400)


# ================== MEETING ==================

@api_view(['GET', 'POST'])
def company_meeting_list_create(request):
    if request.method == 'GET':
        meetings = get_filtered_queryset(CompanyMeeting, request)
        return Response(CompanyMeetingSerializer(meetings, many=True).data)

    if request.method == 'POST':
        serializer = CompanyMeetingSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)

        return Response(serializer.errors, status=400)


# ================== EMAIL ==================

@api_view(['GET', 'POST'])
def company_email_list_create(request):

    if request.method == 'GET':
        emails = CompanyEmail.objects.all()
        return Response(CompanyEmailSerializer(emails, many=True).data)

    if request.method == 'POST':
        serializer = CompanyEmailSerializer(data=request.data)

        if serializer.is_valid():
            email = serializer.save()

            send_mail(
                subject=email.subject,
                message=email.body,
                from_email='mehreenamehri83@gmail.com',
                recipient_list=[email.to_email],
                fail_silently=False,
            )

            return Response({
                "message": "Email sent successfully",
                "data": serializer.data
            }, status=201)

        return Response(serializer.errors, status=400)

# ================== ACTIVITY ==================

@api_view(['GET'])
def company_activity(request, company_id):
    return Response({
        "tasks": CompanyTaskSerializer(CompanyTask.objects.filter(company_id=company_id), many=True).data,
        "notes": CompanyNoteSerializer(CompanyNote.objects.filter(company_id=company_id), many=True).data,
        "calls": CompanyCallSerializer(CompanyCall.objects.filter(company_id=company_id), many=True).data,
        "meetings": CompanyMeetingSerializer(CompanyMeeting.objects.filter(company_id=company_id), many=True).data,
        "emails": CompanyEmailSerializer(CompanyEmail.objects.filter(company_id=company_id), many=True).data,
    })


@api_view(['POST'])
def upload_company_attachment(request, company_id):
    data = request.data.copy()
    data['company'] = company_id

    serializer = CompanyAttachmentSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors)


from django.shortcuts import get_object_or_404

@api_view(['DELETE'])
def delete_company_attachment(request, pk):
    attachment = get_object_or_404(CompanyAttachment, pk=pk)

    # file storage ല്‍ നിന്നുള്ള file delete ചെയ്യും
    if attachment.file:
        attachment.file.delete(save=False)

    attachment.delete()

    return Response(
        {"message": "Attachment deleted successfully"},
        status=204
    )