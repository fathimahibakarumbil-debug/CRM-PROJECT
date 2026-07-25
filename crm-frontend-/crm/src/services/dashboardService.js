import api from "./api";

/* Dashboard APIs */

export const fetchSummaryAPI = () => api.get("dashboard/summary/");

export const fetchConversionAPI = () => api.get("dashboard/conversion/");

export const fetchSalesAPI = () => api.get("dashboard/sales/");

export const fetchTeamAPI = () => api.get("dashboard/team/");
