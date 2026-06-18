import axios from 'axios';

// API URL - muhit o'zgaruvchisi yoki default
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3005/api/v1';

export const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: { 
        'Content-Type': 'application/json' 
    },
    timeout: 10000,
});

// Request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        console.log(`📤 ${config.method.toUpperCase()} ${config.url}`);
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
axiosInstance.interceptors.response.use(
    (response) => {
        console.log(`📥 ${response.status} ${response.config.url}`);
        return response;
    },
    (error) => {
        console.error('❌ API xatosi:', error.response?.data?.message || error.message);
        return Promise.reject(error);
    }
);

export default axiosInstance;