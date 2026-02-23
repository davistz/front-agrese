import axios from 'axios';
import { getToken } from '../utils/auth';

const api = axios.create({
    baseURL: 'http://localhost:4000/api',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

api.interceptors.request.use(
    (config) => {
        const token = getToken();
        console.log('[API] Token encontrado:', token ? 'SIM' : 'NÃO');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
            console.log('[API] Header Authorization adicionado');
        } else {
            console.warn('[API] Nenhum token encontrado para autenticação');
        }
        return config;
    },
    (error) => {
        console.error('[API] Erro no interceptor de request:', error);
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        console.error('[API] Erro na resposta:', error.response?.status, error.response?.data);

        if (error.response?.status === 401) {
            console.warn('[API] Token inválido ou expirado (401). Redirecionando para login...');

            localStorage.removeItem('token');

            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }

        return Promise.reject(error);
    }
);

export default api;
