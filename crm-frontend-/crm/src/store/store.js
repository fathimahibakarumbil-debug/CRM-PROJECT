import { configureStore } from "@reduxjs/toolkit";
import leadReducer from "./leadSlice";
import authReducer from "./authSlice";
import dealReducer from "./dealSlice";
import ticketReducer from "./ticketSlice";
import companyReducer from "./CompanySlice";
import dashboardReducer from "./DashboardSlice";
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
