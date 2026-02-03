import { apiClient } from '../api/client';
import type { PessoaRequest, PessoaResponse } from '../types/api.types';
import { ENDPOINTS } from '../utils/constants';

export const pessoaService = {
  async criar(dados: PessoaRequest): Promise<void> {
    await apiClient.post(ENDPOINTS.PESSOA, dados);
  },
  async atualizar(id: string, dados: PessoaRequest): Promise<void> {
    await apiClient.put(`${ENDPOINTS.PESSOA}/${id}`, dados);
  },
  async buscarTodas(): Promise<PessoaResponse[]> {
    const response = await apiClient.get<PessoaResponse[]>(ENDPOINTS.PESSOA);
    return response.data;
  },
  async buscarPorId(id: string): Promise<PessoaResponse> {
    const response = await apiClient.get<PessoaResponse>(`${ENDPOINTS.PESSOA}/${id}`);
    return response.data;
  },
  async deletar(id: string): Promise<void> {
    await apiClient.delete(`${ENDPOINTS.PESSOA}/${id}`);
  },
};
