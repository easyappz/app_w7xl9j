import instance from './axios';
import { getToken } from './authStorage';

// Attach Authorization header with token to all outgoing requests where token is available
instance.interceptors.request.use(
  (config) => {
    const token = getToken();

    if (token) {
      if (!config.headers) {
        // Ensure headers object exists
        // eslint-disable-next-line no-param-reassign
        config.headers = {};
      }

      // eslint-disable-next-line no-param-reassign
      config.headers.Authorization = `Token ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;
