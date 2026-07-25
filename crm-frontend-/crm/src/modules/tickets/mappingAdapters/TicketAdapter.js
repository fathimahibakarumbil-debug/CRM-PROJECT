// ===============================
// SIDEBAR PROFILE MAPPER
// ===============================
export const mapTicketToSidebarProfile = (ticket) => {
  if (!ticket) return null;

  return {
    // ✅ use mapped frontend field
    name: ticket.ticketName || "N/A",

    subtext: ticket.ticketStatus
      ? `Status : ${formatLabel(ticket.ticketStatus)}`
      : "Status : New",

    avatarLetter: ticket.ticketName
      ? ticket.ticketName.substring(0, 2).toUpperCase()
      : "TK",

    aiSummary: {
      title: "AI Ticket Summary",
      icon: "robot",
      message:
        ticket.aiSummary || "No activities available for this ticket yet.",
    },
  };
};

// ===============================
// SIDEBAR INFO MAPPER
// ===============================
export const mapTicketToSidebarInfo = (ticket) => {
  if (!ticket) return [];

  return [
    {
      key: "description",
      label: "Ticket Description",
      value: ticket.description || "No description provided",
    },
    {
      key: "owner",
      label: "Ticket Owner",
      value: ticket.ticketOwner || "Unassigned",
    },
    {
      key: "priority",
      label: "Priority",
      value: formatLabel(ticket.priority) || "Medium",

      type: "select",
      options: [
        { label: "High", value: "high" },
        { label: "Medium", value: "medium" },
        { label: "Low", value: "low" },
        { label: "Critical", value: "critical" },
      ],
    },
    {
      key: "status",
      label: "Status",
      value: formatLabel(ticket.ticketStatus),

      type: "select",
      options: [
        { label: "New", value: "new" },
        { label: "Waiting on contact", value: "waiting_on_contact" },
        { label: "Waiting on us", value: "waiting_on_us" },
        { label: "Closed", value: "closed" },
      ],
    },
    {
      key: "source",
      label: "Source",
      value: formatLabel(ticket.source),

      type: "select",
      options: [
        { label: "Chat", value: "chat" },
        { label: "Email", value: "email" },
        { label: "Phone", value: "phone" },
      ],
    },
    {
      key: "createdDate",
      label: "Created Date",
      value: ticket.createdDate
        ? new Date(ticket.createdDate).toLocaleString()
        : "N/A",
      disabled: true,
    },
  ];
};

// ===============================
// HELPER FUNCTION (IMPORTANT)
// ===============================
const formatLabel = (value) => {
  if (!value) return "";

  return value.replaceAll("_", " ").replace(/\b\w/g, (c) => c.toUpperCase());
};
