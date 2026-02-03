import { apiClient } from '../api/client';
import { ENDPOINTS } from '../utils/constants';
import type { CategoriaRequest, CategoriaResponse } from '../types/api.types';

export const categoriaService = {
  async criar(dados: CategoriaRequest): Promise<void> {
    await apiClient.post(ENDPOINTS.CATEGORIA, dados);
  },
  async atualizar(id: string, dados: CategoriaRequest): Promise<void> {
    await apiClient.put(`${ENDPOINTS.CATEGORIA}/${id}`, dados);
  },
  async buscarTodas(): Promise<CategoriaResponse[]> {
    const response = await apiClient.get<CategoriaResponse[]>(ENDPOINTS.CATEGORIA);
    return response.data;
  },
  async buscarPorId(id: string): Promise<CategoriaResponse> {
    const response = await apiClient.get<CategoriaResponse>(`${ENDPOINTS.CATEGORIA}/${id}`);
    return response.data;
  },
  async deletar(id: string): Promise<void> {
    await apiClient.delete(`${ENDPOINTS.CATEGORIA}/${id}`);
  },
};
