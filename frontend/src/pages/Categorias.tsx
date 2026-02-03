import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Tag } from 'lucide-react';
import { Card } from '../components/Card';
import { Modal } from '../components/Modal';
import { Loading } from '../components/Loading';
import { useCategorias } from '../hooks/useCategorias';
import { obterTextoFinalidade } from '../utils/formatters';
import type { CategoriaRequest, CategoriaResponse } from '../types/api.types';
import { EFinalidadeCategoria } from '../types/api.types';
import { ModalDelete } from '../components/ModalDelete';

export const Categorias = () => {
  const {
    categorias,
    carregando,
    erro,
    criarCategoria,
    atualizarCategoria,
    deletarCategoria,
  } = useCategorias();
  const [categoriaParaExcluir, setCategoriaParaExcluir] = useState<string | null>(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [categoriaEmEdicao, setCategoriaEmEdicao] = useState<CategoriaResponse | null>(null);
  const [formData, setFormData] = useState<CategoriaRequest>({
    descricao: '',
    finalidade: EFinalidadeCategoria.Ambos,
  });

  useEffect(() => {
    if (modalAberto && !categoriaEmEdicao) {
      setFormData({ descricao: '', finalidade: EFinalidadeCategoria.Ambos });
    } else if (modalAberto && categoriaEmEdicao) {
      setFormData({
        descricao: categoriaEmEdicao.descricao,
        finalidade: categoriaEmEdicao.finalidadeCategoria,
      });
    }
  }, [modalAberto, categoriaEmEdicao]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let sucesso = false;
    if (categoriaEmEdicao) {
      sucesso = await atualizarCategoria(categoriaEmEdicao.id, formData);
    } else {
      sucesso = await criarCategoria(formData);
    }

    if (sucesso) {
      setModalAberto(false);
      setCategoriaEmEdicao(null);
    }
  };

  const handleEdit = (categoria: CategoriaResponse) => {
    setCategoriaEmEdicao(categoria);
    setModalAberto(true);
  };

  const handleCloseModal = () => {
    setModalAberto(false);
    setCategoriaEmEdicao(null);
  };

  const obterCoresFinalidade = (finalidade: EFinalidadeCategoria) => {
    switch (finalidade) {
      case EFinalidadeCategoria.Receita:
        return { bg: 'bg-green-100', text: 'text-green-700', icon: 'bg-green-100' };
      case EFinalidadeCategoria.Despesa:
        return { bg: 'bg-red-100', text: 'text-red-700', icon: 'bg-red-100' };
      case EFinalidadeCategoria.Ambos:
        return { bg: 'bg-purple-100', text: 'text-purple-700', icon: 'bg-purple-100' };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-700', icon: 'bg-gray-100' };
    }
  };

  return (
    <div className="px-3 sm:px-0">
      <Card>
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">
              Gerenciar Categorias
            </h2>
            <p className="text-xs sm:text-sm text-gray-600">
              Cadastre categorias para organizar suas transações
            </p>
          </div>

          <button
            onClick={() => setModalAberto(true)}
            className="
          w-full sm:w-auto
          flex items-center justify-center gap-2
          px-5 py-3
          bg-gradient-to-r from-purple-600 to-purple-900
          text-white rounded-lg text-sm font-semibold
          hover:shadow-lg hover:shadow-purple-500/30
          transition-all
        "
          >
            <Plus size={18} />
            Nova Categoria
          </button>
        </div>

        {erro && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm mb-4">
            {erro}
          </div>
        )}

        {carregando ? (
          <Loading />
        ) : categorias.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <Tag size={48} className="mx-auto mb-4" />
            <p className="text-base">Nenhuma categoria cadastrada ainda.</p>
            <p className="text-sm mt-2">Clique em "Nova Categoria" para começar.</p>
          </div>
        ) : (
          /* GRID RESPONSIVA */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {categorias.map((categoria) => {
              const cores = obterCoresFinalidade(categoria.finalidadeCategoria);

              return (
                <div
                  key={categoria.id}
                  className="
                bg-gray-50 rounded-xl p-4 sm:p-5
                border-2 border-transparent
                hover:border-purple-600 hover:-translate-y-1 hover:shadow-lg
                transition-all
              "
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 ${cores.icon} rounded-xl flex items-center justify-center`}>
                      <Tag size={24} className={cores.text} />
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(categoria)}
                        className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-purple-50 hover:border-purple-600 text-purple-600"
                      >
                        <Edit size={16} />
                      </button>

                      <button
                        onClick={() => setCategoriaParaExcluir(categoria.id)}
                        className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-red-50 hover:border-red-600 text-red-600"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-3 break-words">
                    {categoria.descricao}
                  </h3>

                  <span className={`inline-block px-3 py-1 rounded-md text-xs font-semibold ${cores.bg} ${cores.text}`}>
                    {obterTextoFinalidade(categoria.finalidadeCategoria)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* MODAL */}
      <Modal
        isOpen={modalAberto}
        onClose={handleCloseModal}
        title={categoriaEmEdicao ? 'Editar Categoria' : 'Nova Categoria'}
      >
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-5">

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Descrição *</label>
              <input
                type="text"
                required
                maxLength={400}
                value={formData.descricao}
                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                placeholder="Ex: Alimentação, Salário, Transporte..."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-sm focus:border-purple-600 focus:outline-none transition-colors duration-200"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Finalidade *</label>
              <select
                required
                value={formData.finalidade}
                onChange={(e) => setFormData({
                  ...formData,
                  finalidade: Number(e.target.value) as EFinalidadeCategoria
                })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-sm focus:border-purple-600 focus:outline-none transition-colors duration-200 cursor-pointer"
              >
                <option value={EFinalidadeCategoria.Receita}>Receita</option>
                <option value={EFinalidadeCategoria.Despesa}>Despesa</option>
                <option value={EFinalidadeCategoria.Ambos}>Ambos</option>
              </select>
              <p className="text-xs text-gray-600 mt-1">
                Define se a categoria pode ser usada para receitas, despesas ou ambos
              </p>
            </div>

            {/* BOTÕES RESPONSIVOS */}
            <div className="flex flex-col sm:flex-row gap-3 sm:justify-end mt-2">
              <button
                type="button"
                onClick={handleCloseModal}
                className="w-full sm:w-auto px-6 py-3 bg-gray-100 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-200"
              >
                Cancelar
              </button>

              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-purple-600 to-purple-900 text-white rounded-lg text-sm font-semibold hover:shadow-lg hover:shadow-purple-500/30"
              >
                {categoriaEmEdicao ? 'Salvar Alterações' : 'Criar Categoria'}
              </button>
            </div>
          </div>
        </form>
      </Modal>

      <ModalDelete
        open={!!categoriaParaExcluir}
        onClose={() => setCategoriaParaExcluir(null)}
        onConfirm={async () => {
          await deletarCategoria(categoriaParaExcluir!);
          setCategoriaParaExcluir(null);
        }}
        titulo="Excluir categoria"
        descricao={
          <>
            Tem certeza que deseja excluir esta categoria?
            <span className="block text-red-600 font-semibold mt-1">
              Essa ação não pode ser desfeita.
            </span>
          </>
        }
        carregando={carregando}
      />
    </div>
  );
};
