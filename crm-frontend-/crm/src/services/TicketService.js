import api from "./api";

// ==============================
// 🎟️ TICKET CRUD (BACKEND API)
// ==============================

// GET ALL TICKETS
export const getTickets = async () => {
  const res = await api.get("tickets/");
  return res.data;
};

// GET SINGLE TICKET
export const getTicketById = async (id) => {
  const res = await api.get(`tickets/${id}/`);
  return res.data;
};

// CREATE TICKET
export const createTicket = async (data) => {
  const res = await api.post("tickets/", data);
  return res.data;
};

// UPDATE TICKET
export const updateTicket = async (id, data) => {
  const res = await api.put(`tickets/${id}/`, data);
  return res.data;
};

// DELETE TICKET
export const deleteTicket = async (id) => {
  await api.delete(`tickets/${id}/`);
  return id;
};
