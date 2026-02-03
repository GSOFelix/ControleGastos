// Enums que vêm da API
export const EFinalidadeCategoria = {
  Receita: 1,
  Despesa: 2,
  Ambos: 3,
} as const;

export type EFinalidadeCategoria =
  typeof EFinalidadeCategoria[keyof typeof EFinalidadeCategoria];

export const ETipoTransacao = {
  Receita: 1,
  Despesa: 2,
} as const;

export type ETipoTransacao =
  typeof ETipoTransacao[keyof typeof ETipoTransacao];

// DTOs de Categoria
export interface CategoriaRequest {
  descricao: string;
  finalidade: EFinalidadeCategoria;
}

export interface CategoriaResponse {
  id: string;
  descricao: string;
  finalidadeCategoria: EFinalidadeCategoria;
}

// DTOs de Pessoa
export interface PessoaRequest {
  nome: string;
  idade: number;
}

export interface PessoaResponse {
  id: string;
  nome: string;
  idade: number;
}

// DTOs de Transação
export interface TransacaoRequest {
  descricao: string;
  valor: number;
  tipo: ETipoTransacao;
  pessoaId: string;
  categoriaId: string;
}

export interface TransacaoResponse {
  id: string;
  descricao: string;
  valor: number;
  tipo: ETipoTransacao;
  pessoaId: string;
  categoriaId: string;
}

// DTOs de Relatórios
export interface RelatorioCategoriaItem {
  id: string;
  descricao: string;
  totalReceita: number;
  totalDespesa: number;
  saldo: number;
}

export interface RelatorioCategoriaResponse {
  categoria: RelatorioCategoriaItem[];
  totalReceitas: number;
  totalDespesas: number;
  saldoLiquido: number;
}

export interface RelatorioPessoaItem {
  id: string;
  nome: string;
  totalReceita: number;
  totalDespesa: number;
  saldo: number;
}

export interface RelatorioPessoaResponse {
  pessoas: RelatorioPessoaItem[];
  totalReceitas: number;
  totalDespesas: number;
  saldoLiquido: number;
}
