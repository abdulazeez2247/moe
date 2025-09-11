// import axios from 'axios';

// // const API_URL = "http://localhost:9000";
// const API_URL = "https://moe-backend-3.onrender.com/api";

// // Create axios instance with base URL including /api
// const api = axios.create({
//   baseURL: `${API_URL}/api`, // ADD /api HERE
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// // Request interceptor to add auth token
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // Response interceptor to handle errors
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       localStorage.removeItem("token");
//       window.location.href = "/login";
//     }
//     return Promise.reject(error);
//   }
// );

// // Auth API - REMOVE /auth prefix since baseURL has /api
// export const authAPI = {
//   signup: (userData) => api.post("/auth/signup", userData),
//   login: (credentials) => api.post("/auth/login", credentials),
//   refreshToken: (token) => api.post("/auth/refresh-token", { token }),
//   forgotPassword: (email) => api.post("/auth/forgot-password", { email }),
//   resetPassword: (token, passwords) => api.post(`/auth/reset-password/${token}`, passwords),
//   getMe: () => api.get("/auth/me"),
// };

// export const fileAPI = {
//   upload: (file) => {
//     const formData = new FormData();
//     formData.append("file", file);
//     return api.post("/upload/upload", formData, { // FIXED PATH
//       headers: { "Content-Type": "multipart/form-data" },
//     });
//   },
//   getHistory: () => api.get("/upload/history"), // FIXED PATH
// };

// export const knowledgeAPI = {
//   getStatus: () => api.get("/knowledge/status"),
// };

// export const paymentAPI = {
//   createSubscription: (planData) => api.post("/payments/create-subscription", planData),
//   confirmPayment: (paymentData) => api.post("/payments/confirm-payment", paymentData),
//   createPaymentIntent: (data) => api.post("/payments/create-payment-intent", data), // ADDED
//   confirmPaymentIntent: (data) => api.post("/payments/confirm-payment-intent", data), // ADDED
//   // REMOVE handleWebhook - this should only be called by Stripe, not frontend
// };

// export const questionsAPI = {
//   askQuestion: (questionData) => api.post("/ask", questionData),
//   voteAnswer: (answerId, vote) => api.post(`/ask/${answerId}/vote`, { vote }),
//   getCatalog: (params) => api.get("/ask/catalog", { params }),
// };

// export const userAPI = {
//   getProfile: () => api.get("/users/profile"),
//   updateProfile: (profileData) => api.patch("/users/profile", profileData),
//   getUsage: () => api.get("/users/usage"),
// };

// // Utility functions
// export const setAuthToken = (token) => {
//   if (token) {
//     localStorage.setItem("token", token);
//   } else {
//     localStorage.removeItem("token");
//   }
// };

// export const getAuthToken = () => localStorage.getItem("token");
// export const isAuthenticated = () => !!localStorage.getItem("token");
// export const logout = () => {
//   localStorage.removeItem("token");
//   window.location.href = "/login";
// };

// export default api;
import axios from "axios";

// ✅ Root only, no /api here
const apiurl = "https://moe-backend-3.onrender.com";
// const apiurl = "http://localhost:9000";

// ====================== AUTH ======================
const signup = async (userData) => {
  return await axios.post(`${apiurl}/api/auth/signup`, userData);
};

const login = async (credentials) => {
  return await axios.post(`${apiurl}/api/auth/login`, credentials);
};

const refreshToken = async (token) => {
  return await axios.post(`${apiurl}/api/auth/refresh-token`, { token });
};

const forgotPassword = async (email) => {
  return await axios.post(`${apiurl}/api/auth/forgot-password`, { email });
};

const resetPassword = async (token, passwords) => {
  return await axios.post(`${apiurl}/api/auth/reset-password/${token}`, passwords);
};

const getMe = async () => {
  return await axios.get(`${apiurl}/api/auth/me`);
};

// ====================== FILE UPLOAD ======================
const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  return await axios.post(`${apiurl}/api/upload/upload`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

const getUploadHistory = async () => {
  return await axios.get(`${apiurl}/api/upload/history`);
};

// ====================== KNOWLEDGE ======================
const getKnowledgeStatus = async () => {
  return await axios.get(`${apiurl}/api/knowledge/status`);
};

// ====================== PAYMENTS ======================
const createSubscription = async (planData) => {
  return await axios.post(`${apiurl}/api/payments/create-subscription`, planData);
};

const confirmPayment = async (paymentData) => {
  return await axios.post(`${apiurl}/api/payments/confirm-payment`, paymentData);
};

const createPaymentIntent = async (data) => {
  return await axios.post(`${apiurl}/api/payments/create-payment-intent`, data);
};

const confirmPaymentIntent = async (data) => {
  return await axios.post(`${apiurl}/api/payments/confirm-payment-intent`, data);
};

// ====================== QUESTIONS ======================
const askQuestion = async (questionData) => {
  return await axios.post(`${apiurl}/api/ask`, questionData);
};

const voteAnswer = async (answerId, vote) => {
  return await axios.post(`${apiurl}/api/ask/${answerId}/vote`, { vote });
};

const getCatalog = async (params) => {
  return await axios.get(`${apiurl}/api/ask/catalog`, { params });
};

// ====================== USER ======================
const getProfile = async () => {
  return await axios.get(`${apiurl}/api/users/profile`);
};

const updateProfile = async (profileData) => {
  return await axios.patch(`${apiurl}/api/users/profile`, profileData);
};

const getUsage = async () => {
  return await axios.get(`${apiurl}/api/users/usage`);
};

// ====================== EXPORTS ======================
export {
  signup,
  login,
  refreshToken,
  forgotPassword,
  resetPassword,
  getMe,
  uploadFile,
  getUploadHistory,
  getKnowledgeStatus,
  createSubscription,
  confirmPayment,
  createPaymentIntent,
  confirmPaymentIntent,
  askQuestion,
  voteAnswer,
  getCatalog,
  getProfile,
  updateProfile,
  getUsage,
};
