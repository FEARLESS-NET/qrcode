/**
 * Axios sozlamalari.
 * Base URL (localhost / production), interceptorlar (request/response log, xatoliklarni qayta ishlash).
 * JWT token avtomatik qo'shiladi va 401 da chiqish.
 */
import axios from 'axios';

const BASE_URL = import.meta.env.DEV 
  ? 'http://localhost:3005/api/v1' 
  : import.meta.env.VITE_API_URL || 'https://backend-4-9otm.onrender.com/api/v1';

export const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    timeout: 8000,
});

// Request interceptor – tokenni avtomatik qo'shish
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('adminToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        console.log(`📤 ${config.method.toUpperCase()} ${config.url}`);
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor – 401 da tokenni o'chirish va login ga yo'naltirish
axiosInstance.interceptors.response.use(
    (response) => {
        console.log(`📥 ${response.status} ${response.config.url}`);
        return response;
    },
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('adminToken');
            localStorage.removeItem('adminUser');
            window.location.href = '/login';
        }
        console.error('❌ API xatosi:', error.response?.data?.message || error.message);
        return Promise.reject(error);
    }
);

export default axiosInstance;