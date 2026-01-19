import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';
import type { AuthResponse, RefreshTokenRequest } from '@/types/auth';

// Cria instância do axios com configuração base
const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Flag para prevenir múltiplas tentativas de refresh simultâneas (se várias abas abertas com o token expirado, trata para não ter várias chamadas simultâneas)
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// Interceptor de requisição: adiciona o access token automaticamente no header
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const accessToken = localStorage.getItem('accessToken');

    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de resposta: se erro 401, tenta dar refresh no token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Se erro 401 em rota autenticada
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/auth')
    ) {
      if (isRefreshing) {
        // Se já está fazendo refresh, adiciona requisição à fila
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem('refreshToken');

      if (!refreshToken) {
        // Se não tem refresh token, redireciona para login
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(error);
      }

      try {
        // Tenta fazer refresh do token
        const { data } = await axios.post<AuthResponse>(
          `${api.defaults.baseURL}/auth/refresh-token`,
          { refreshToken } as RefreshTokenRequest
        );

        // Salva novos tokens no localStorage
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        localStorage.setItem('user', JSON.stringify(data.user));

        // Atualiza header da requisição original
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;

        // Processa fila de requisições pendentes
        processQueue(null, data.accessToken);

        isRefreshing = false;

        // Retenta a requisição original
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh falhou, faz logout
        processQueue(refreshError as Error, null);
        isRefreshing = false;

        localStorage.clear();
        window.location.href = '/login';

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
