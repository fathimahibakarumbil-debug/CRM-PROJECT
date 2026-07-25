import api from "./api";

export const fetchNotifications = () => api.get("/notifications/");

// export const markAsRead = (id) => api.patch(`/notifications/${id}/read/`);

export const markAsRead = (id) =>
  api.patch(`/notifications/${id}/read/`);