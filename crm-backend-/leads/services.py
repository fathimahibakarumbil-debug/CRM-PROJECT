from .serializers import (
    TaskSerializer,
    NoteSerializer,
    CallSerializer,
    MeetingSerializer,
    EmailSerializer,
)


def get_all_activities(lead):
    activities = []

    for t in lead.tasks.all():
        activities.append(
            {
                "id": t.id,
                "type": "task",
                "title": t.title,
                "description": t.description,
                "due_date": t.dueDate,
                "due_time": str(t.due_time) if t.due_time else None,
                "status": t.status,
                "priority": t.priority,
                "assigned_to": t.assigned_to,
                "created_at": t.createdAt,
            }
        )

    for n in lead.notes.all():
        activities.append(
            {
                "id": n.id,
                "type": "note",
                "content": n.content,
                "created_at": n.createdAt,
            }
        )

    for c in lead.calls.all():
        activities.append(
            {
                "id": c.id,
                "type": "call",
                "description": c.description,
                "connected": c.connected,
                "outcome": c.outcome,
                "call_time": c.callTime,
                "created_at": c.createdAt,
            }
        )

    for m in lead.meetings.all():
        activities.append(
            {
                "id": m.id,
                "type": "meeting",
                "title": m.title,
                "description": m.description,
                "outcome": m.outcome,
                "date": m.date,
                "start_time": m.start_time,
                "end_time": m.end_time,
                "location": m.location,
                "attendees": m.attendees,
                "organized_by": m.organized_by,
                "created_at": m.createdAt,
            }
        )

    for e in lead.emails.all():
        activities.append(
            {
                "id": e.id,
                "type": "email",
                "subject": e.subject,
                "body": e.body,
                "to_email": e.to_email,
                "sent_at": e.sentAt,
                "created_at": e.createdAt,
                "attachments": [a.file.url for a in e.attachments.all()],
            }
        )

    activities.sort(key=lambda x: x["created_at"], reverse=True)

    return activities


from deals.models import Deal


def convert_lead_to_deal(lead, data):
    deal = Deal.objects.create(
        deal_name=data.get("deal_name", f"{lead.firstName} {lead.lastName}"),
        deal_owner=data.get("deal_owner", lead.contactOwner),
        deal_stage=data.get("deal_stage", "Contact"),
        amount=data.get("amount"),
        close_date=data.get("close_date"),
        priority=data.get("priority", "Medium"),
        email=lead.email,
        phone=lead.phone,
        lead=lead,
    )

    lead.leadStatus = "Converted"
    lead.save()

    return deal