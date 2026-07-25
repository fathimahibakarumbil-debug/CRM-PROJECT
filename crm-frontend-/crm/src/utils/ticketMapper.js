// ===============================
// FRONTEND → BACKEND
// ===============================
export const mapToBackend = (ticket) => {
  return {
    ticket_name: ticket.ticketName,
    description: ticket.description,
    ticket_status: ticket.ticketStatus,
    priority: ticket.priority,
    source: ticket.source,
    ticket_owner: ticket.ticketOwner || "Admin",
  };
};

// ===============================
// BACKEND → FRONTEND
// ===============================
export const mapToFrontend = (ticket) => {
  return {
    id: ticket.id,
    ticketName: ticket.ticket_name,
    description: ticket.description,
    ticketStatus: ticket.ticket_status,
    priority: ticket.priority,
    source: ticket.source,
    ticketOwner: ticket.ticket_owner,
  };
};
