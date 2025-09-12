import axios from 'axios';

const API_URL = "https://moe-backend-3.onrender.com";

const api = axios.create({
  baseURL: `${API_URL}/api`,
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
  signup: (userData) => api.post("/auth/signup", userData),
  login: (credentials) => api.post("/auth/login", credentials),
  refreshToken: (token) => api.post("/auth/refresh-token", { token }),
  forgotPassword: (email) => api.post("/auth/forgot-password", { email }),
  resetPassword: (token, passwords) => api.post(`/auth/reset-password/${token}`, passwords),
  getMe: () => api.get("/auth/me"),
};

export const fileAPI = {
  upload: (file) => {
    const formData = new FormData();
    formData.append("file", file);
    return api.post("/upload/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  getHistory: () => api.get("/upload/history"),
};

export const knowledgeAPI = {
  getStatus: () => api.get("/knowledge/status"),
};

export const paymentAPI = {
  createSubscription: (planData) => api.post("/payments/create-subscription", planData),
  confirmPayment: (paymentData) => api.post("/payments/confirm-payment", paymentData),
  createPaymentIntent: (data) => api.post("/payments/create-payment-intent", data),
  confirmPaymentIntent: (data) => api.post("/payments/confirm-payment-intent", data),
};

export const questionsAPI = {
  askQuestion: (questionData) => api.post("/ask", questionData),
  voteAnswer: (answerId, vote) => api.post(`/ask/${answerId}/vote`, { vote }),
  getCatalog: (params) => api.get("/ask/catalog", { params }),
};

export const userAPI = {
  getProfile: () => api.get("/users/profile"),
  updateProfile: (profileData) => api.patch("/users/profile", profileData),
  getUsage: () => api.get("/users/usage"),
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