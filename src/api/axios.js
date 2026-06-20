import axios from 'axios';

// ✅ /api/v1 ni o'zi qo'shadi — .env da faqat base URL yozing
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3005/api/v1';

export const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    timeout: 30000,
});

axiosInstance.interceptors.request.use(
    (config) => {
        console.log(`📤 ${config.method.toUpperCase()} ${config.url}`);
        return config;
    },
    (error) => Promise.reject(error)
);

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