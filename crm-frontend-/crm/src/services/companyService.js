import api from "./api";

/* ===============================
      COMPANY API SERVICES
    ================================ */

// GET ALL COMPANIES
export const getCompanies = async () => {
  const response = await api.get("/companies/");
  return response.data;
};

// GET COMPANY BY ID (DETAIL PAGE)
export const getCompanyById = async (id) => {
  const response = await api.get(`/companies/${id}/`);
  return response.data;
};

// CREATE COMPANY
export const createCompany = async (companyData) => {
  const response = await api.post("/companies/", companyData);
  return response.data;
};

// UPDATE COMPANY
export const updateCompany = async (id, companyData) => {
  const response = await api.put(`/companies/${id}/`, companyData);
  return response.data;
};

// DELETE COMPANY
export const deleteCompany = async (id) => {
  await api.delete(`/companies/${id}/`);
  return id;
};

/* ===============================
      COMPANY ACTIVITIES
    ================================ */

// GET ALL ACTIVITY OF COMPANY
export const getCompanyActivity = async (companyId) => {
  const response = await api.get(`/companies/activity/${companyId}/`);
  return response.data;
};

/* ===============================
      TASKS
    ================================ */

export const createTask = async (taskData) => {
  const response = await api.post("/companies/tasks/", taskData);
  return response.data;
};

/* ===============================
      NOTES
    ================================ */

export const createNote = async (noteData) => {
  const response = await api.post("/companies/notes/", noteData);
  return response.data;
};

/* ===============================
      CALLS
    ================================ */

export const createCall = async (callData) => {
  const response = await api.post("/companies/calls/", callData);
  return response.data;
};

/* ===============================
      MEETINGS
    ================================ */

export const createMeeting = async (meetingData) => {
  const response = await api.post("/companies/meetings/", meetingData);
  return response.data;
};

/* ===============================
      EMAILS
    ================================ */

export const sendCompanyEmail = async (emailData) => {
  const response = await api.post("/companies/emails/", emailData);
  return response.data;
};

/* ===============================
      ATTACHMENTS
    ================================ */

export const uploadAttachment = async (companyId, file) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post(
    `/companies/${companyId}/attachments/`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return response.data;
};
