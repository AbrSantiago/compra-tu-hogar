import axios, { AxiosError } from 'axios';

interface BackendError {
  detail?: string;
  friendlyMessage?: string;
}

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
  (error: AxiosError<BackendError>) => {
    if (error.response) {
      const status = error.response.status;
      const data = (error.response.data as BackendError) || {};

      const backendDetail = data.detail;

      switch (status) {
        case 400:
          if (backendDetail?.includes('registered')) {
            data.friendlyMessage = 'El correo electrónico ya se encuentra registrado.';
          } else {
            data.friendlyMessage = backendDetail || 'Los datos enviados son incorrectos.';
          }
          break;

        case 401:
          localStorage.removeItem('token');
          localStorage.removeItem('type');
          data.friendlyMessage = 'Usuario o contraseña incorrectos. Verificá tus credenciales.';
          break;

        case 403:
          data.friendlyMessage = 'No tenés autorización para realizar esta acción.';
          break;

        case 409:
          data.friendlyMessage = backendDetail || 'Ya existe un registro con esos datos.';
          break;

        case 422:
          data.friendlyMessage = 'Los datos no cumplen con el formato requerido.';
          break;

        case 500:
          data.friendlyMessage = 'Ocurrió un error en el servidor. Intentalo más tarde.';
          break;

        default:
          data.friendlyMessage = backendDetail || 'Ocurrió un error inesperado.';
      }
      
      error.response.data = data;
    } else if (error.request) {
      error.message = 'No se pudo conectar con el servidor. Verificá tu conexión.';
    }

    return Promise.reject(error);
  }
);

export default apiClient;