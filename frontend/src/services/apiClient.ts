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

      const backendDetail = data?.detail;

      switch (status) {
        case 400:
          console.warn('Solicitud incorrecta:', backendDetail);
          if (backendDetail === 'Email already registered' || backendDetail?.includes('registered')) {
            data.friendlyMessage = 'El correo electrónico ya se encuentra registrado.';
          } else {
            data.friendlyMessage = backendDetail || 'Los datos enviados son incorrectos.';
          }
          break;

        case 401:
          localStorage.removeItem('token');
          localStorage.removeItem('type'); 
          console.warn('Credenciales incorrectas o sesión expirada.');
          
          data.friendlyMessage = 'Usuario o contraseña incorrectos. Verificá tus credenciales.';
          break;

        case 403:
          console.error('No tenés permisos para realizar esta acción.');
          data.friendlyMessage = 'No tenés autorización para realizar esta acción.';
          break;

        case 409:
          console.warn('Conflicto de duplicidad.', backendDetail);
          data.friendlyMessage = backendDetail || 'Ya existe un registro con esos datos.';
          break;

        case 422:
          console.error('Error de validación en el backend:', backendDetail);
          data.friendlyMessage = 'Los datos no cumplen con el formato requerido.';
          break;

        case 500:
          console.error('Error interno del servidor.');
          data.friendlyMessage = 'Ocurrió un error en el servidor. Intentalo más tarde.';
          break;

        default:
          console.error(`Error (${status}):`, backendDetail || 'Ocurrió un error inesperado');
          data.friendlyMessage = backendDetail || 'Ocurrió un error inesperado.';
      }
    } else if (error.request) {
      console.error('No se pudo conectar con el servidor.');
      error.message = 'No se pudo conectar con el servidor. Verificá tu conexión.';
    } else {
      console.error('Error al procesar la petición:', error.message);
    }

    return Promise.reject(error);
  }
);

export default apiClient;