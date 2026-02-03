import { apiClient } from '../api/client';
import { ENDPOINTS } from '../utils/constants';
import type {
  TransacaoRequest,
  TransacaoResponse,
  RelatorioPessoaResponse,
  RelatorioCategoriaResponse,
} from '../types/api.types';

export const transacaoService = {
  async criar(dados: TransacaoRequest): Promise<void> {
    await apiClient.post(ENDPOINTS.TRANSACAO, dados);
  },
  async atualizar(id: string, dados: TransacaoRequest): Promise<void> {
    await apiClient.put(`${ENDPOINTS.TRANSACAO}/${id}`, dados);
  },
  async buscarTodas(): Promise<TransacaoResponse[]> {
    const response = await apiClient.get<TransacaoResponse[]>(ENDPOINTS.TRANSACAO);
    return response.data;
  },
  async buscarPorId(id: string): Promise<TransacaoResponse> {
    const response = await apiClient.get<TransacaoResponse>(`${ENDPOINTS.TRANSACAO}/${id}`);
    return response.data;
  },
  async deletar(id: string): Promise<void> {
    await apiClient.delete(`${ENDPOINTS.TRANSACAO}/${id}`);
  },
  async buscarRelatorioPessoa(): Promise<RelatorioPessoaResponse> {
    const response = await apiClient.get<RelatorioPessoaResponse>(ENDPOINTS.RELATORIO_PESSOA);
    return response.data;
  },
  async buscarRelatorioCategoria(): Promise<RelatorioCategoriaResponse> {
    const response = await apiClient.get<RelatorioCategoriaResponse>(ENDPOINTS.RELATORIO_CATEGORIA);
    return response.data;
  },
};
