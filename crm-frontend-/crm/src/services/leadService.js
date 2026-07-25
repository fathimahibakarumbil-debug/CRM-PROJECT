import api from "./api";

// -----------------------------
// LEADS
// -----------------------------

export const getLeads = () => api.get("/leads/");

export const getLeadById = (id) => api.get(`/leads/${id}/`);

export const createLead = (data) => api.post("/leads/", data);

export const updateLead = (id, data) => api.put(`/leads/update/${id}/`, data);

export const deleteLead = (id) => api.delete(`/leads/delete/${id}/`);

// -----------------------------
// ACTIVITIES (UNIFIED SYSTEM)
// -----------------------------

// Get all activities of a lead
export const getLeadActivities = (leadId) =>
  api.get(`/leads/activity/${leadId}/`);

// Add any activity (task, call, meeting, note, email)
export const addLeadActivity = (leadId, data) =>
  api.post(`/leads/activity/${leadId}/`, data);

// Update activity
export const updateLeadActivity = (activityId, data) =>
  api.put(`/leads/activity/update/${activityId}/`, data);

// Delete activity


export const deleteLeadActivity = (id, type) =>
  api.delete(`/leads/activity/delete/${id}/?type=${type}`);

// -----------------------------
// ATTACHMENTS
// -----------------------------

export const uploadLeadAttachment = (leadId, file) => {
  const formData = new FormData();
  formData.append("file", file);

  return api.post(`/leads/${leadId}/attachments/`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const deleteLeadAttachment = (attachmentId) =>
  api.delete(`/leads/attachments/${attachmentId}/`);

// -----------------------------
// CONVERT LEAD → DEAL
// -----------------------------

export const convertLeadApi = (id, data) =>
  api.post(`/leads/convert/${id}/`, data);

export const sendLeadEmailApi = (leadId, data) =>
  api.post(`/leads/${leadId}/send-email/`, data);