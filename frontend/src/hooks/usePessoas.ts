import { useState, useEffect, useCallback } from 'react';
import type { PessoaRequest, PessoaResponse } from '../types/api.types';
import { pessoaService } from '../services/pessoaService';
import { MENSAGENS } from '../utils/constants';

export const usePessoas = () => {
  const [pessoas, setPessoas] = useState<PessoaResponse[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const buscarPessoas = useCallback(async () => {
    setCarregando(true);
    setErro(null);
    try {
      const dados = await pessoaService.buscarTodas();
      setPessoas(dados);
    } catch (err) {
      const mensagemErro = err instanceof Error ? err.message : MENSAGENS.ERRO_GENERICO;
      setErro(mensagemErro);
      console.error('Erro ao buscar pessoas:', err);
    } finally {
      setCarregando(false);
    }
  }, []);

  const criarPessoa = async (dados: PessoaRequest): Promise<boolean> => {
    setCarregando(true);
    setErro(null);
    try {
      await pessoaService.criar(dados);
      await buscarPessoas();
      return true;
    } catch (err) {
      const mensagemErro = err instanceof Error ? err.message : MENSAGENS.ERRO_GENERICO;
      setErro(mensagemErro);
      console.error('Erro ao criar pessoa:', err);
      return false;
    } finally {
      setCarregando(false);
    }
  };

  const atualizarPessoa = async (id: string, dados: PessoaRequest): Promise<boolean> => {
    setCarregando(true);
    setErro(null);
    try {
      await pessoaService.atualizar(id, dados);
      await buscarPessoas();
      return true;
    } catch (err) {
      const mensagemErro = err instanceof Error ? err.message : MENSAGENS.ERRO_GENERICO;
      setErro(mensagemErro);
      console.error('Erro ao atualizar pessoa:', err);
      return false;
    } finally {
      setCarregando(false);
    }
  };

  const deletarPessoa = async (id: string): Promise<boolean> => {
    setCarregando(true);
    setErro(null);
    try {
      await pessoaService.deletar(id);
      await buscarPessoas();
      return true;
    } catch (err) {
      const mensagemErro = err instanceof Error ? err.message : MENSAGENS.ERRO_GENERICO;
      setErro(mensagemErro);
      console.error('Erro ao deletar pessoa:', err);
      return false;
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    buscarPessoas();
  }, [buscarPessoas]);

  return {
    pessoas,
    carregando,
    erro,
    buscarPessoas,
    criarPessoa,
    atualizarPessoa,
    deletarPessoa,
  };
};
