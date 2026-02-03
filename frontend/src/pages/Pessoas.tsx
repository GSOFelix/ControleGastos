import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, User } from 'lucide-react';
import { Card } from '../components/Card';
import { Modal } from '../components/Modal';
import { Loading } from '../components/Loading';
import { usePessoas } from '../hooks/usePessoas';
import type { PessoaRequest, PessoaResponse } from '../types/api.types';
import { ModalDelete } from '../components/ModalDelete';

export const Pessoas = () => {
  const {
    pessoas,
    carregando,
    erro,
    criarPessoa,
    atualizarPessoa,
    deletarPessoa,
  } = usePessoas();
  const [pessoaParaExcluir, setPessoaParaExcluir] = useState<string | null>(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [pessoaEmEdicao, setPessoaEmEdicao] = useState<PessoaResponse | null>(null);
  const [formData, setFormData] = useState<PessoaRequest>({
    nome: '',
    idade: 18,
  });

  useEffect(() => {
    if (modalAberto && !pessoaEmEdicao) {
      setFormData({ nome: '', idade: 18 });
    } else if (modalAberto && pessoaEmEdicao) {
      setFormData({
        nome: pessoaEmEdicao.nome,
        idade: pessoaEmEdicao.idade,
      });
    }
  }, [modalAberto, pessoaEmEdicao]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let sucesso = false;
    if (pessoaEmEdicao) {
      sucesso = await atualizarPessoa(pessoaEmEdicao.id, formData);
    } else {
      sucesso = await criarPessoa(formData);
    }

    if (sucesso) {
      setModalAberto(false);
      setPessoaEmEdicao(null);
    }
  };

  const handleEdit = (pessoa: PessoaResponse) => {
    setPessoaEmEdicao(pessoa);
    setModalAberto(true);
  };

  const handleCloseModal = () => {
    setModalAberto(false);
    setPessoaEmEdicao(null);
  };

  return (
    <div>
      <Card>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Gerenciar Pessoas</h2>
            <p className="text-sm text-gray-600">Cadastre e gerencie pessoas do sistema</p>
          </div>
          <button
            onClick={() => setModalAberto(true)}
            className="w-full md:w-auto flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-purple-600 to-purple-900 text-white rounded-lg text-sm font-semibold hover:shadow-lg hover:shadow-purple-500/30 hover:-translate-y-0.5 transition-all duration-200"
          >
            <Plus size={18} />
            Nova Pessoa
          </button>
        </div>

        {erro && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm mb-4">
            {erro}
          </div>
        )}

        {carregando ? (
          <Loading />
        ) : pessoas.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <User size={48} className="mx-auto mb-4" />
            <p className="text-base">Nenhuma pessoa cadastrada ainda.</p>
            <p className="text-sm mt-2">Clique em "Nova Pessoa" para começar.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {pessoas.map((pessoa) => (
              <div
                key={pessoa.id}
                className="bg-gray-50 rounded-xl p-4 md:p-5 border-2 border-transparent hover:border-purple-600 hover:-translate-y-1 hover:shadow-lg transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-900 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30">
                    <User size={24} className="text-white" />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(pessoa)}
                      className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-purple-50 hover:border-purple-600 text-purple-600 transition-colors duration-200"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => setPessoaParaExcluir(pessoa.id)}
                      className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-red-50 hover:border-red-600 text-red-600 transition-colors duration-200"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-2">{pessoa.nome}</h3>

                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${pessoa.idade < 18
                      ? 'bg-orange-100 text-orange-700'
                      : 'bg-green-100 text-green-700'
                    }`}>
                    {pessoa.idade} anos
                  </span>
                  {pessoa.idade < 18 && (
                    <span className="text-xs text-gray-600 font-medium">(Menor de idade)</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Modal de Criar/Editar Pessoa */}
      <Modal
        isOpen={modalAberto}
        onClose={handleCloseModal}
        title={pessoaEmEdicao ? 'Editar Pessoa' : 'Nova Pessoa'}
      >
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-5">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Nome *</label>
              <input
                type="text"
                required
                maxLength={200}
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                placeholder="Digite o nome completo"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-sm focus:border-purple-600 focus:outline-none transition-colors duration-200"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Idade *</label>
              <input
                type="number"
                required
                min="1"
                max="150"
                value={formData.idade}
                onChange={(e) => setFormData({ ...formData, idade: Number(e.target.value) })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-sm focus:border-purple-600 focus:outline-none transition-colors duration-200"
              />
              {formData.idade < 18 && (
                <p className="text-xs text-orange-600 mt-1">
                  ⚠️ Menores de idade só podem ter despesas cadastradas
                </p>
              )}
            </div>

            <div className="flex gap-3 justify-end mt-2">
              <button
                type="button"
                onClick={handleCloseModal}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-200 transition-colors duration-200"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-purple-900 text-white rounded-lg text-sm font-semibold hover:shadow-lg hover:shadow-purple-500/30 hover:-translate-y-0.5 transition-all duration-200"
              >
                {pessoaEmEdicao ? 'Salvar Alterações' : 'Criar Pessoa'}
              </button>
            </div>
          </div>
        </form>
      </Modal>

      <ModalDelete
        open={!!pessoaParaExcluir}
        onClose={() => setPessoaParaExcluir(null)}
        onConfirm={async () => {
          await deletarPessoa(pessoaParaExcluir!);
          setPessoaParaExcluir(null);
        }}
        titulo="Excluir Pessoa"
        descricao={
          <>
            Tem certeza que deseja excluir esta pessoa?
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
