import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { parseCookies } from 'nookies';

export function apiServices(ctx: any) {
  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_URL_BACKEND,
  });

  api.interceptors.request.use(
    (config: InternalAxiosRequestConfig<any>) => {
      const cookies = parseCookies(ctx);
      const token = cookies["cripto.auth"];

      if (token) {
        if (config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }

      return config;
    },
    (error: AxiosError) => {
      console.error('Request error:', error);
      return Promise.reject(error);
    }
  );

  return api;
}
