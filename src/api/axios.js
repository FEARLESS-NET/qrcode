import axios from 'axios'

export const axiosInstance = axios.create({
    // localhost-ni o'chirib, Render linkini qo'ying
    baseURL: 'https://backend-1-6vfo.onrender.com/api/v1/', 
    headers: { 'Content-Type': 'application/json' }
})