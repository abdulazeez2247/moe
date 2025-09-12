import axios from "axios";

const API_URL = "https://moe-backend-3.onrender.com/api";

// ---------- AUTH ----------
export const signup = (userData) =>
  axios.post(`${API_URL}/auth/signup`, userData);

export const login = (credentials) =>
  axios.post(`${API_URL}/auth/login`, credentials);

export const refreshToken = (token) =>
  axios.post(`${API_URL}/auth/refresh-token`, { token });

export const forgotPassword = (email) =>
  axios.post(`${API_URL}/auth/forgot-password`, { email });

export const resetPassword = (token, passwords) =>
  axios.post(`${API_URL}/auth/reset-password/${token}`, passwords);

export const getMe = () => axios.get(`${API_URL}/auth/me`);

// ---------- FILE UPLOAD ----------
export const uploadFile = (file) => {
  const formData = new FormData();
  formData.append("file", file);
  return axios.post(`${API_URL}/upload/upload`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const getUploadHistory = () =>
  axios.get(`${API_URL}/upload/history`);

// ---------- KNOWLEDGE ----------
export const getKnowledgeStatus = () =>
  axios.get(`${API_URL}/knowledge/status`);

// ---------- PAYMENTS ----------
export const createSubscription = (planData) =>
  axios.post(`${API_URL}/payments/create-subscription`, planData);

export const confirmPayment = (paymentData) =>
  axios.post(`${API_URL}/payments/confirm-payment`, paymentData);

export const createPaymentIntent = (data) =>
  axios.post(`${API_URL}/payments/create-payment-intent`, data);

export const confirmPaymentIntent = (data) =>
  axios.post(`${API_URL}/payments/confirm-payment-intent`, data);

// ---------- QUESTIONS ----------
export const askQuestion = (questionData) =>
  axios.post(`${API_URL}/ask`, questionData);

export const voteAnswer = (answerId, vote) =>
  axios.post(`${API_URL}/ask/${answerId}/vote`, { vote });

export const getCatalog = (params) =>
  axios.get(`${API_URL}/ask/catalog`, { params });

// ---------- USER ----------
export const getProfile = () =>
  axios.get(`${API_URL}/users/profile`);

export const updateProfile = (profileData) =>
  axios.patch(`${API_URL}/users/profile`, profileData);

export const getUsage = () =>
  axios.get(`${API_URL}/users/usage`);

// ---------- AUTH HELPERS ----------
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
