import axios from 'axios';

// Agar .env da VITE_API_URL bo'lsa ishlatadi, aks holda localhost
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3005/api/v1';

export const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' }
});
