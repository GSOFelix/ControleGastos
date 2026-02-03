import { useState, useEffect, useCallback } from 'react';
import type { CategoriaRequest, CategoriaResponse } from '../types/api.types';
import { categoriaService } from '../services/categoriaService';
import { MENSAGENS } from '../utils/constants';

export const useCategorias = () => {
  const [categorias, setCategorias] = useState<CategoriaResponse[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const buscarCategorias = useCallback(async () => {
    setCarregando(true);
    setErro(null);
    try {
      const dados = await categoriaService.buscarTodas();
      setCategorias(dados);
    } catch (err) {
      const mensagemErro = err instanceof Error ? err.message : MENSAGENS.ERRO_GENERICO;
      setErro(mensagemErro);
      console.error('Erro ao buscar categorias:', err);
    } finally {
      setCarregando(false);
    }
  }, []);

  const criarCategoria = async (dados: CategoriaRequest): Promise<boolean> => {
    setCarregando(true);
    setErro(null);
    try {
      await categoriaService.criar(dados);
      await buscarCategorias();
      return true;
    } catch (err) {
      const mensagemErro = err instanceof Error ? err.message : MENSAGENS.ERRO_GENERICO;
      setErro(mensagemErro);
      console.error('Erro ao criar categoria:', err);
      return false;
    } finally {
      setCarregando(false);
    }
  };

  const atualizarCategoria = async (id: string, dados: CategoriaRequest): Promise<boolean> => {
    setCarregando(true);
    setErro(null);
    try {
      await categoriaService.atualizar(id, dados);
      await buscarCategorias();
      return true;
    } catch (err) {
      const mensagemErro = err instanceof Error ? err.message : MENSAGENS.ERRO_GENERICO;
      setErro(mensagemErro);
      console.error('Erro ao atualizar categoria:', err);
      return false;
    } finally {
      setCarregando(false);
    }
  };

  const deletarCategoria = async (id: string): Promise<boolean> => {   
    setCarregando(true);
    setErro(null);
    try {
      await categoriaService.deletar(id);
      await buscarCategorias();
      return true;
    } catch (err) {
      const mensagemErro = err instanceof Error ? err.message : MENSAGENS.ERRO_GENERICO;
      setErro(mensagemErro);
      console.error('Erro ao deletar categoria:', err);
      return false;
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    buscarCategorias();
  }, [buscarCategorias]);

  return {
    categorias,
    carregando,
    erro,
    buscarCategorias,
    criarCategoria,
    atualizarCategoria,
    deletarCategoria,
  };
};
