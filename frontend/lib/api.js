import axios from 'axios';

const api = axios.create({
  // Proxy requests through Next.js to bypass CORS
  baseURL: process.env.NEXT_PUBLIC_API_URL || '/backend',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    // If running in the browser, attach the JWT token to every request
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Automatically handle unauthorized errors
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        // Clear token and redirect to login if the user's session expires
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
