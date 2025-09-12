import axios from 'axios';

const API_URL = "https://moe-backend-3.onrender.com";

const api = axios.create({
  baseURL: API_URL,
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

export const authAPI = {
  signup: (userData) => api.post("/api/auth/signup", userData),
  login: (credentials) => api.post("/api/auth/login", credentials),
  refreshToken: (token) => api.post("/api/auth/refresh-token", { token }),
  forgotPassword: (email) => api.post("/api/auth/forgot-password", { email }),
  resetPassword: (token, passwords) => api.post(`/api/auth/reset-password/${token}`, passwords),
  getMe: () => api.get("/api/auth/me"),
};

export const fileAPI = {
  upload: (file) => {
    const formData = new FormData();
    formData.append("file", file);
    return api.post("/api/upload/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  getHistory: () => api.get("/api/upload/history"),
};

export const knowledgeAPI = {
  getStatus: () => api.get("/api/knowledge/status"),
};

export const paymentAPI = {
  createSubscription: (planData) => api.post("/api/payments/create-subscription", planData),
  confirmPayment: (paymentData) => api.post("/api/payments/confirm-payment", paymentData),
  createPaymentIntent: (data) => api.post("/api/payments/create-payment-intent", data),
  confirmPaymentIntent: (data) => api.post("/api/payments/confirm-payment-intent", data),
};

export const questionsAPI = {
  askQuestion: (questionData) => api.post("/api/ask", questionData),
  voteAnswer: (answerId, vote) => api.post(`/api/ask/${answerId}/vote`, { vote }),
  getCatalog: (params) => api.get("/api/ask/catalog", { params }),
};

export const userAPI = {
  getProfile: () => api.get("/api/users/profile"),
  updateProfile: (profileData) => api.patch("/api/users/profile", profileData),
  getUsage: () => api.get("/api/users/usage"),
};

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