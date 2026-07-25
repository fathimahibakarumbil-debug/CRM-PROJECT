export const normalizeActivity = (a) => {
  const type = (a.type || a.activity_type || "").toLowerCase();

  return {
    id: a.id,
    type,

    title: a.title || "",
    description: a.description || a.content || a.notes || "",
    content: a.content || "",
    notes: a.notes || "",

    dueDate: a.due_date || a.dueDate || "",
    callTime: a.call_time || a.callTime || "",
    meetingTime: a.meeting_time || a.meetingTime || "",

    subject: a.subject || "",
    body: a.body || "",
    to_email: a.to_email || "",

    status: a.status || "",
    priority: a.priority || "",
    location: a.location || "",

    created_at: a.created_at || a.createdAt || "",
    sent_at: a.sent_at || a.sentAt || "",
    outcome: a.outcome || "",
    connected: a.connected || "",

    due_time: a.due_time || a.dueTime || "",
    assigned_to: a.assigned_to || "",

    date: a.date || "",
    startTime: a.start_time || a.startTime || "",
    endTime: a.end_time || a.endTime || "",

    attendees: a.attendees || [],
    organized_by: a.organized_by || "",

       meeting_details: a.meeting_details
      ? {
          date: a.meeting_details.date || "",

          startTime:
            a.meeting_details.startTime ||
            a.meeting_details.start_time ||
            "",

          endTime:
            a.meeting_details.endTime ||
            a.meeting_details.end_time ||
            "",

          attendees: a.meeting_details.attendees || [],

          organized_by: a.meeting_details.organized_by || "",

          description: a.meeting_details.description || "",

          outcome: a.meeting_details.outcome || "",
        }
      : null,
  
  };
  
};

export const formatActivityForApi = (a) => {
  const type = (a.type || "").toLowerCase();

  switch (type) {
    // case "task":
    //   return {
    //     type,
    //     title: a.title,
    //     description: a.description,
    //     dueDate: a.dueDate,
    //     status: a.status,
    //     priority: a.priority,
    //   };
    case "task":
      return {
        type,
        title: a.title || "",
        description: a.description || "",

        dueDate: a.dueDate ? a.dueDate.split("T")[0] : null,
        // due_time: a.dueDate ? a.dueDate.split("T")[1] + ":00" : null,
        due_time:
          a.due_time && a.due_time !== "undefined"
            ? a.due_time.length === 5
              ? `${a.due_time}:00`
              : a.due_time
            : null,

        status: a.status || "Open",
        priority: a.priority || "",
        assigned_to: a.assigned_to || "",
      };

    case "note":
      return {
        type,
        content: a.content || a.description,
      };

    case "call":
      return {
        type,
        description: a.notes || a.description,
        callTime: a.callTime,
        outcome: a.outcome,
        connected: a.connected,
      };

    case "meeting":
      return {
        type,
        title: a.title,
        description: a.description,

        date: a.date,
        startTime: a.startTime,
        endTime: a.endTime,
        attendees: a.attendees,

        location: a.location,
      };

    case "email":
      return {
        type,
        subject: a.subject,
        body: a.body,
        to_email: a.to_email,
      };

    default:
      return a;
  }
};
