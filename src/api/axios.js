import axios from 'axios'

export const axiosInstance = axios.create({
    baseURL: 'https://backend-1-6vfo.onrender.com/api/v1/',
    headers: { 'Content-Type': 'application/json' }
})