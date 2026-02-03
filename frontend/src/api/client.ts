import axios, { type AxiosInstance, AxiosError } from 'axios';
import { API_BASE_URL, CONFIG } from '../utils/constants';

/**
 * Instância configurada do Axios
 * Centraliza configurações e interceptors
 */
const criarClienteApi = (): AxiosInstance => {
  const cliente = axios.create({
    baseURL: API_BASE_URL,
    timeout: CONFIG.TIMEOUT_REQUISICAO,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Interceptor de requisição
  cliente.interceptors.request.use(
    (config) => {
      console.log(`Requisição: ${config.method?.toUpperCase()} ${config.url}`);
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Interceptor de resposta (tratamento global de erros)
  cliente.interceptors.response.use(
    (response) => {
      return response;
    },
    (error: AxiosError) => {
      if (error.response) {
        const mensagem =
          (error.response.data as any)?.message ||
          (error.response.data as any)?.error ||
          `Erro ${error.response.status}`;
        console.error('Erro na API:', mensagem);
        return Promise.reject(new Error(mensagem));
      } else if (error.request) {
        console.error('Erro de rede:', error.message);
        return Promise.reject(
          new Error('Erro de conexão. Verifique sua internet.')
        );
      } else {
        console.error('Erro:', error.message);
        return Promise.reject(error);
      }
    }
  );

  return cliente;
};

export const apiClient = criarClienteApi();
