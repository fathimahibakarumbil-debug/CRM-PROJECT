import { Routes, Route, BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store/store";

import LoginForm from "./modules/login/LoginForm";
import RegistrationForm from "./modules/registration/RegistrationForm";
import MainLayout from "./components/layout/MainLayout";
import Dashboard from "./modules/dashboard/Dashboard";
import LeadsList from "./modules/leads/LeadsList";
import LeadDetails from "./modules/leads/LeadDetails";
import DealsList from "./modules/deals/DealsList";
import DealDetails from "./modules/deals/DealDetails";
import TicketList from "./modules/tickets/TicketList.jsx";
import TicketDetails from "./modules/tickets/TicketDetails";
import ProtectedRoute from "./components/common/ProtectedRoute";
import ForgotPasswordForm from "./modules/registration/ForgotPasswordForm";
import ResetPasswordForm from "./modules/registration/ResetPasswordForm";
import CompaniesList from "./modules/companies/CompaniesList";
import CompanyDetails from "./modules/companies/CompanyDetails.jsx";

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>

          {/* Public routes */}
          <Route path="/" element={<LoginForm />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegistrationForm />} />
          <Route path="/forgot-password" element={<ForgotPasswordForm />} />
          <Route path="/reset-password" element={<ResetPasswordForm />} />

          {/* Protected layout */}
          <Route
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            {/* Common routes */}
            <Route path="/dashboard" element={<Dashboard />} />

            {/* Admin മാത്രം access */}
            <Route element={<ProtectedRoute roles={["admin"]} />}>
              <Route path="/leads" element={<LeadsList />} />
              <Route path="/leads/:id" element={<LeadDetails />} />
              <Route path="/companies" element={<CompaniesList />} />
              <Route path="/companies/:id" element={<CompanyDetails />} />
            </Route>

            {/* Deals */}
            <Route path="/deals" element={<DealsList />} />
            <Route path="/deals/:id" element={<DealDetails />} />

            {/* Tickets */}
            <Route path="/tickets" element={<TicketList />} />
            <Route path="/tickets/:id" element={<TicketDetails />} />
          </Route>

        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;