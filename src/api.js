import axios from "axios";

// Base backend URL
const BASE_URL = "http://localhost:4000/api/v1";

// Axios instance
const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,               // ✔ SEND COOKIES WITH EVERY REQUEST
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach JWT token automatically (if you ever use localStorage token)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// --------------------
// AUTH ROUTES
// --------------------
export const loginAirtable = () =>
  axios.get(`${BASE_URL}/auth/login`, { withCredentials: true });

export const airtableCallback = (code) =>
  api.get(`/auth/callback?code=${code}`);

// --------------------
// FORM ROUTES
// --------------------
export const createForm = (formData) => api.post("/form", formData);
export const getMyForms = () => api.get("/form");
export const getFormById = (formId) => api.get(`/form/${formId}`);
export const updateForm = (formId, formData) =>
  api.put(`/form/${formId}`, formData);
export const deleteForm = (formId) => api.delete(`/form/${formId}`);

// --------------------
// RESPONSE ROUTES
// --------------------
export const createResponse = (responseData) =>
  api.post("/response", responseData);
export const getResponses = (formId) => api.get(`/response/form/${formId}`);
export const getResponseById = (responseId) =>
  api.get(`/response/${responseId}`);
export const updateResponse = (responseId, responseData) =>
  api.put(`/response/${responseId}`, responseData);
export const deleteResponse = (responseId) =>
  api.delete(`/response/${responseId}`);

// --------------------
// AIRTABLE ROUTES
// --------------------
export const getAirtableBases = () => api.get("/airtable/bases");
export const getAirtableTables = (baseId) =>
  api.get(`/airtable/tables/${baseId}`);
export const getAirtableFields = (baseId, tableId) =>
  api.get(`/airtable/fields/${baseId}/${tableId}`);

// --------------------
// WEBHOOK ROUTES
// --------------------
export const triggerWebhook = (data) =>
  axios.post("http://localhost:4000/webhooks/airtable", data, {
    withCredentials: true,
  });



