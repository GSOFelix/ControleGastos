// URL base da API - ajuste conforme seu ambiente
export const API_BASE_URL = 'http://localhost:5161/api';

// Endpoints da API
export const ENDPOINTS = {
  CATEGORIA: '/categoria',
  PESSOA: '/pessoa',
  TRANSACAO: '/transacao',
  RELATORIO_PESSOA: '/transacao/relatorio-pessoa',
  RELATORIO_CATEGORIA: '/transacao/relatorio-categoria',
} as const;

// Mensagens padrão
export const MENSAGENS = {
  ERRO_GENERICO: 'Ocorreu um erro. Tente novamente.',
  SUCESSO_CRIAR: 'Cadastro realizado com sucesso!',
  SUCESSO_ATUALIZAR: 'Atualizado com sucesso!',
  SUCESSO_DELETAR: 'Excluído com sucesso!',
  CONFIRMAR_EXCLUSAO: 'Tem certeza que deseja excluir?',
} as const;

// Configurações
export const CONFIG = {
  TIMEOUT_REQUISICAO: 30000, // 30 segundos
} as const;
