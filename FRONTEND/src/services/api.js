import axios from 'axios';

const api = axios.create({
    // Si existe la variable de entorno en producción, usa esa. Si no, usa localhost para desarrollo.
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
});

export default api;