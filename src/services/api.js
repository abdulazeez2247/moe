import axios from 'axios';

const API_URL = "https://moe-backend-3.onrender.com/api";

const api = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// ---------- AUTH ----------
export const authAPI = {
  signup: (userData) => api.post(`${API_URL}/auth/signup`, userData),
  login: (credentials) => api.post(`${API_URL}/auth/login`, credentials),
  refreshToken: (token) => api.post(`${API_URL}/auth/refresh-token`, { token }),
  forgotPassword: (email) => api.post(`${API_URL}/auth/forgot-password`, { email }),
  resetPassword: (token, passwords) => api.post(`${API_URL}/auth/reset-password/${token}`, passwords),
  getMe: () => api.get(`${API_URL}/auth/me`),
};

// ---------- FILE UPLOAD ----------
export const fileAPI = {
  upload: (file) => {
    const formData = new FormData();
    formData.append("file", file);
    return api.post(`${API_URL}/upload/upload`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  getHistory: () => api.get(`${API_URL}/upload/history`),
};

// ---------- KNOWLEDGE ----------
export const knowledgeAPI = {
  getStatus: () => api.get(`${API_URL}/knowledge/status`),
};

// ---------- PAYMENTS ----------
export const paymentAPI = {
  createSubscription: (planData) => api.post(`${API_URL}/payments/create-subscription`, planData),
  confirmPayment: (paymentData) => api.post(`${API_URL}/payments/confirm-payment`, paymentData),
  createPaymentIntent: (data) => api.post(`${API_URL}/payments/create-payment-intent`, data),
  confirmPaymentIntent: (data) => api.post(`${API_URL}/payments/confirm-payment-intent`, data),
};

// ---------- QUESTIONS ----------
export const questionsAPI = {
  askQuestion: (questionData) => api.post(`${API_URL}/ask`, questionData),
  voteAnswer: (answerId, vote) => api.post(`${API_URL}/ask/${answerId}/vote`, { vote }),
  getCatalog: (params) => api.get(`${API_URL}/ask/catalog`, { params }),
};

// ---------- USER ----------
export const userAPI = {
  getProfile: () => api.get(`${API_URL}/users/profile`),
  updateProfile: (profileData) => api.patch(`${API_URL}/users/profile`, profileData),
  getUsage: () => api.get(`${API_URL}/users/usage`),
};

// ---------- TOKEN HELPERS ----------
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem("token", token);
  } else {
    localStorage.removeItem("token");
  }
};

export const getAuthToken = () => localStorage.getItem("token");
export const isAuthenticated = () => !!localStorage.getItem("token");
export const logout = () => {
  localStorage.removeItem("token");
  window.location.href = "/login";
};

export default api;
