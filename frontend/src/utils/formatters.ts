import { EFinalidadeCategoria, ETipoTransacao } from '../types/api.types';

/**
 * Formata número para moeda brasileira
 */
export const formatarMoeda = (valor: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(valor);
};

/**
 * Converte enum de finalidade para texto
 */
export const obterTextoFinalidade = (
  finalidade: EFinalidadeCategoria
): string => {
  switch (finalidade) {
    case EFinalidadeCategoria.Receita:
      return 'Receita';
    case EFinalidadeCategoria.Despesa:
      return 'Despesa';
    case EFinalidadeCategoria.Ambos:
      return 'Ambos';
    default:
      return 'Desconhecido';
  }
};

/**
 * Converte enum de tipo de transação para texto
 */
export const obterTextoTipoTransacao = (tipo: ETipoTransacao): string => {
  switch (tipo) {
    case ETipoTransacao.Receita:
      return 'Receita';
    case ETipoTransacao.Despesa:
      return 'Despesa';
    default:
      return 'Desconhecido';
  }
};

/**
 * Valida se uma pessoa é menor de idade
 */
export const ehMenorDeIdade = (idade: number): boolean => {
  return idade < 18;
};
