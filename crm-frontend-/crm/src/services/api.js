import axios from "axios";

/* ===============================
   AXIOS INSTANCE
================================ */

const api = axios.create({
  // baseURL: "http://127.0.0.1:8000/api/",
  baseURL: "https://crm-project-hsic.onrender.com/api/",
  headers: {
    "Content-Type": "application/json",
  },
});

/* ===============================
   REQUEST INTERCEPTOR
   → Attach JWT Token Automatically
================================ */

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

/* ===============================
   RESPONSE INTERCEPTOR (OPTIONAL)
   → Auto Logout if Token Expired
================================ */

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default api;
