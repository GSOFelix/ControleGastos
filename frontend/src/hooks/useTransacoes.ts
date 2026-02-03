import { useState, useEffect, useCallback } from 'react';
import { transacaoService } from '../services/transacaoService';
import { MENSAGENS } from '../utils/constants';
import type {
  TransacaoResponse,
  TransacaoRequest,
  RelatorioPessoaResponse,
  RelatorioCategoriaResponse,
} from '../types/api.types';

export const useTransacoes = () => {
  const [transacoes, setTransacoes] = useState<TransacaoResponse[]>([]);
  const [relatorioPessoa, setRelatorioPessoa] = useState<RelatorioPessoaResponse | null>(null);
  const [relatorioCategoria, setRelatorioCategoria] = useState<RelatorioCategoriaResponse | null>(null);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const buscarTransacoes = useCallback(async () => {
    setCarregando(true);
    setErro(null);
    try {
      const dados = await transacaoService.buscarTodas();
      setTransacoes(dados);
    } catch (err) {
      const mensagemErro = err instanceof Error ? err.message : MENSAGENS.ERRO_GENERICO;
      setErro(mensagemErro);
      console.error('Erro ao buscar transações:', err);
    } finally {
      setCarregando(false);
    }
  }, []);

  const buscarRelatorioPessoa = useCallback(async () => {
    setCarregando(true);
    setErro(null);
    try {
      const dados = await transacaoService.buscarRelatorioPessoa();
      setRelatorioPessoa(dados);
    } catch (err) {
      const mensagemErro = err instanceof Error ? err.message : MENSAGENS.ERRO_GENERICO;
      setErro(mensagemErro);
      console.error('Erro ao buscar relatório de pessoa:', err);
    } finally {
      setCarregando(false);
    }
  }, []);

  const buscarRelatorioCategoria = useCallback(async () => {
    setCarregando(true);
    setErro(null);
    try {
      const dados = await transacaoService.buscarRelatorioCategoria();
      setRelatorioCategoria(dados);
    } catch (err) {
      const mensagemErro = err instanceof Error ? err.message : MENSAGENS.ERRO_GENERICO;
      setErro(mensagemErro);
      console.error('Erro ao buscar relatório de categoria:', err);
    } finally {
      setCarregando(false);
    }
  }, []);

  const criarTransacao = async (dados: TransacaoRequest): Promise<boolean> => {
    setCarregando(true);
    setErro(null);
    try {
      await transacaoService.criar(dados);
      await buscarTransacoes();
      return true;
    } catch (err) {
      const mensagemErro = err instanceof Error ? err.message : MENSAGENS.ERRO_GENERICO;
      setErro(mensagemErro);
      console.error('Erro ao criar transação:', err);
      return false;
    } finally {
      setCarregando(false);
    }
  };

  const atualizarTransacao = async (id: string, dados: TransacaoRequest): Promise<boolean> => {
    setCarregando(true);
    setErro(null);
    try {
      await transacaoService.atualizar(id, dados);
      await buscarTransacoes();
      return true;
    } catch (err) {
      const mensagemErro = err instanceof Error ? err.message : MENSAGENS.ERRO_GENERICO;
      setErro(mensagemErro);
      console.error('Erro ao atualizar transação:', err);
      return false;
    } finally {
      setCarregando(false);
    }
  };

  const deletarTransacao = async (id: string): Promise<boolean> => {
    setCarregando(true);
    setErro(null);
    try {
      await transacaoService.deletar(id);
      await buscarTransacoes();
      return true;
    } catch (err) {
      const mensagemErro = err instanceof Error ? err.message : MENSAGENS.ERRO_GENERICO;
      setErro(mensagemErro);
      console.error('Erro ao deletar transação:', err);
      return false;
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    buscarTransacoes();
  }, [buscarTransacoes]);

  return {
    transacoes,
    relatorioPessoa,
    relatorioCategoria,
    carregando,
    erro,
    buscarTransacoes,
    buscarRelatorioPessoa,
    buscarRelatorioCategoria,
    criarTransacao,
    atualizarTransacao,
    deletarTransacao,
  };
};
