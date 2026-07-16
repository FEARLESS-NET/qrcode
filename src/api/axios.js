import axios from 'axios';

// ✅ Local va Production ni avtomatik aniqlash
const BASE_URL = import.meta.env.DEV 
  ? 'http://localhost:3005/api/v1' 
  : import.meta.env.VITE_API_URL || 'https://backend-4-9otm.onrender.com/api/v1';

export const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    timeout: 8000, // ✅ 30000 → 8000 (tezroq)
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