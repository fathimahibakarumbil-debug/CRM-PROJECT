import api from "./api";

// -----------------------------
// DEALS
// -----------------------------

export const getDeals = () => api.get("/deals");

export const getDealById = (id) => api.get(`/deals/${id}/`);

export const createDeal = (data) => api.post("/deals/", data);

export const updateDeal = (id, data) => api.put(`/deals/update/${id}/`, data);

export const deleteDeal = (id) => api.delete(`/deals/delete/${id}/`);

// -----------------------------
// ACTIVITIES
// -----------------------------

export const getDealActivities = (dealId) =>
  api.get(`/deals/activity/${dealId}/`);

export const addDealActivity = (dealId, data) =>
  api.post(`/deals/activity/${dealId}/`, data);

export const updateDealActivity = (activityId, data) =>
  api.put(`/deals/activity/update/${activityId}/`, data);

export const deleteDealActivity = (activityId) =>
  api.delete(`/deals/activity/delete/${activityId}/`);

// -----------------------------
// ATTACHMENTS
// -----------------------------

export const uploadDealAttachment = (dealId, file) => {
  const formData = new FormData();
  formData.append("file", file);

  return api.post(`/deals/${dealId}/attachments/`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const deleteDealAttachment = (attachmentId) =>
  api.delete(`/deals/attachments/${attachmentId}/`);
