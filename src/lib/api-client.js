import axios from "axios";

// 1. Create a customized axios instance
const api = axios.create({
  baseURL: "/api", // All requests will start with /api
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // CRUCIAL: This allows the browser to send the JWT cookie
});

// 2. Create separate helper functions for each HTTP method
export const apiClient = {
  get: async (url, config = {}) => {
    const response = await api.get(url, config);
    return response.data;
  },

  post: async (url, data, config = {}) => {
    const response = await api.post(url, data, config);
    return response.data;
  },

  put: async (url, data, config = {}) => {
    const response = await api.put(url, data, config);
    return response.data;
  },

  patch: async (url, data, config = {}) => {
    const response = await api.patch(url, data, config);
    return response.data;
  },

  delete: async (url, config = {}) => {
    const response = await api.delete(url, config);
    return response.data;
  },
};