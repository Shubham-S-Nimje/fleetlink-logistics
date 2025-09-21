import axios from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const api = {
  // Vehicle APIs
  vehicles: {
    add: (data) => apiClient.post("/vehicles", data),
    getAll: () => apiClient.get("/vehicles"),
    getById: (id) => apiClient.get(`/vehicles/${id}`),
    getAvailable: (params) => apiClient.get("/vehicles/available", { params }),
  },

  // Booking APIs
  bookings: {
    create: (data) => apiClient.post("/bookings", data),
    getAll: (params) => apiClient.get("/bookings", { params }),
    getById: (id) => apiClient.get(`/bookings/${id}`),
    cancel: (id) => apiClient.delete(`/bookings/${id}`),
    updateStatus: (id, status) =>
      apiClient.put(`/bookings/${id}/status`, { status }),
  },

  // Health check
  health: () =>
    apiClient.get("/health", { baseURL: API_BASE_URL.replace("/api", "") }),
};

export default apiClient;
