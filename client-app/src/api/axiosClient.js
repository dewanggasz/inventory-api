import axios from 'axios';

// Ambil base URL dari environment variable
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
});

// Interceptor untuk menambahkan token otentikasi ke setiap request
axiosClient.interceptors.request.use((config) => {
  // Untuk sekarang, kita akan hardcode token. Nanti kita akan ambil dari state/localStorage.
  // Ganti token di bawah ini dengan token yang Anda dapatkan dari Postman.
  const token = 'HQPBSWiR3abi6bN0zlK83rgOlwWGsqBTbzd7pPNhe23b816d'; 

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default axiosClient;