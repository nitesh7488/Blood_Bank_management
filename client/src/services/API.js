import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_BASEURL,
  headers: {
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache',
    'Expires': '0'
  }
});

// Request interceptor with cache-busting
API.interceptors.request.use((req) => {
  // Add timestamp to prevent caching
  req.params = {
    ...req.params,
    _: Date.now()  // Unique parameter for each request
  };

  // Add auth token if exists
  if (localStorage.getItem("token")) {
    req.headers.Authorization = `Bearer ${localStorage.getItem("token").trim()}`;
  }

  return req;
});

// Response interceptor to handle errors
API.interceptors.response.use(
  (response) => {
    // Transform any 304 responses to force fresh data
    if (response.status === 304) {
      const originalRequest = response.config;
      originalRequest.params._ = Date.now(); // New cache-buster
      return API(originalRequest);
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default API;