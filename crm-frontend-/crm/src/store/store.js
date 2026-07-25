import { configureStore } from "@reduxjs/toolkit";
import leadReducer from "./LeadSlice";
import authReducer from "./AuthSlice";
import companyReducer from "./CompanySlice";
import dashboardReducer from "./DashboardSlice";
import dealReducer from "./DealSlice";
import ticketReducer from "./TicketSlice";
import notificationReducer from "./notificationSlice";
import globalSearchReducer from "./globalSearchSlice";

export const store = configureStore({
  reducer: {
    lead: leadReducer,
    auth: authReducer,
    deal: dealReducer,
    ticket: ticketReducer,
    company: companyReducer,
    dashboard: dashboardReducer,
    notifications: notificationReducer,
    globalSearch: globalSearchReducer,
  },
});

export default store;
