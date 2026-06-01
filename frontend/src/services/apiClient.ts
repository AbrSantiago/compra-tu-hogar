import axios, { AxiosError } from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, 
  headers: {
    'Content-Type': 'application/json', 
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data as any;

      switch (status) {
        case 401:
          localStorage.removeItem('token');
          console.warn('Sesión expirada o token inválido.');
          break;

        case 403:
          console.error('No tenés permisos para realizar esta acción.');
          break;

        case 422:
          console.error('Error de validación en el backend:', data?.detail);
          break;

        case 500:
          console.error('Error interno del servidor.');
          break;

        default:
          console.error(`Error (${status}):`, data?.detail || 'Ocurrió un error inesperado');
      }
    } else if (error.request) {
      console.error('No se pudo conectar con el servidor.');
    } else {
      console.error('Error al procesar la petición:', error.message);
    }

    return Promise.reject(error);
  }
);

export default apiClient;