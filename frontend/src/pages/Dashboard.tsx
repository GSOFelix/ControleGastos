import { useState, useEffect } from 'react';
import { Plus, TrendingUp, TrendingDown, DollarSign, Trash2 } from 'lucide-react';
import { Card } from '../components/Card';
import { Modal } from '../components/Modal';
import { Loading } from '../components/Loading';
import { useTransacoes } from '../hooks/useTransacoes';
import { usePessoas } from '../hooks/usePessoas';
import { useCategorias } from '../hooks/useCategorias';
import { formatarMoeda, obterTextoTipoTransacao, ehMenorDeIdade } from '../utils/formatters';
import { ETipoTransacao, EFinalidadeCategoria, type TransacaoRequest } from '../types/api.types';
import { ModalDelete } from '../components/ModalDelete';

export const Dashboard = () => {
  const {
    transacoes,
    carregando: carregandoTransacoes,
    erro,
    criarTransacao,
    deletarTransacao,
    buscarTransacoes,
  } = useTransacoes();
  const [transacaoParaExcluir, setTransacaoParaExcluir] = useState<string | null>(null);
  const { pessoas } = usePessoas();
  const { categorias } = useCategorias();

  const [modalAberto, setModalAberto] = useState(false);
  const [formData, setFormData] = useState<TransacaoRequest>({
    descricao: '',
    valor: 0,
    tipo: ETipoTransacao.Despesa,
    pessoaId: '',
    categoriaId: '',
  });

  // Calcular totais
  const totalReceitas = transacoes
    .filter((t) => t.tipo === ETipoTransacao.Receita)
    .reduce((sum, t) => sum + t.valor, 0);

  const totalDespesas = transacoes
    .filter((t) => t.tipo === ETipoTransacao.Despesa)
    .reduce((sum, t) => sum + t.valor, 0);

  const saldoLiquido = totalReceitas - totalDespesas;

  // Resetar form ao abrir modal
  useEffect(() => {
    if (modalAberto) {
      setFormData({
        descricao: '',
        valor: 0,
        tipo: ETipoTransacao.Despesa,
        pessoaId: '',
        categoriaId: '',
      });
    }
  }, [modalAberto]);

  // Filtrar categorias baseado no tipo e pessoa selecionada
  const categoriasDisponiveis = categorias.filter((cat) => {
    if (formData.tipo === ETipoTransacao.Receita) {
      return cat.finalidadeCategoria === EFinalidadeCategoria.Receita ||
        cat.finalidadeCategoria === EFinalidadeCategoria.Ambos;
    } else {
      return cat.finalidadeCategoria === EFinalidadeCategoria.Despesa ||
        cat.finalidadeCategoria === EFinalidadeCategoria.Ambos;
    }
  });

  // Verificar se pessoa é menor de idade
  const pessoaSelecionada = pessoas.find((p) => p.id === formData.pessoaId);
  const ehMenor = pessoaSelecionada ? ehMenorDeIdade(pessoaSelecionada.idade) : false;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validação: menor de idade só pode ter despesas
    if (ehMenor && formData.tipo === ETipoTransacao.Receita) {
      alert('Menores de idade só podem ter despesas cadastradas.');
      return;
    }

    const sucesso = await criarTransacao(formData);
    if (sucesso) {
      setModalAberto(false);
      buscarTransacoes();
    }
  };

  const handleDelete = async (id: string) => {
    await deletarTransacao(id);
  };

  const obterNomePessoa = (id: string) => {
    const pessoa = pessoas.find((p) => p.id === id);
    return pessoa?.nome || 'Desconhecida';
  };

  const obterNomeCategoria = (id: string) => {
    const categoria = categorias.find((c) => c.id === id);
    return categoria?.descricao || 'Desconhecida';
  };

  return (
    <div>
      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card hover>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium mb-2">Total de Receitas</p>
              <p className="text-3xl font-bold text-green-600">{formatarMoeda(totalReceitas)}</p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/30">
              <TrendingUp size={28} className="text-white" />
            </div>
          </div>
        </Card>

        <Card hover>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium mb-2">Total de Despesas</p>
              <p className="text-3xl font-bold text-red-600">{formatarMoeda(totalDespesas)}</p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-500/30">
              <TrendingDown size={28} className="text-white" />
            </div>
          </div>
        </Card>

        <Card hover>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium mb-2">Saldo Líquido</p>
              <p className={`text-3xl font-bold ${saldoLiquido >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatarMoeda(saldoLiquido)}
              </p>
            </div>
            <div className={`w-14 h-14 bg-gradient-to-br ${saldoLiquido >= 0 ? 'from-purple-600 to-purple-900' : 'from-orange-500 to-orange-600'
              } rounded-xl flex items-center justify-center shadow-lg ${saldoLiquido >= 0 ? 'shadow-purple-500/30' : 'shadow-orange-500/30'
              }`}>
              <DollarSign size={28} className="text-white" />
            </div>
          </div>
        </Card>
      </div>

      {/* Seção de Transações */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Transações Recentes</h2>
          <button
            onClick={() => setModalAberto(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-900 text-white rounded-lg text-sm font-semibold hover:shadow-lg hover:shadow-purple-500/30 hover:-translate-y-0.5 transition-all duration-200"
          >
            <Plus size={18} />
            Nova Transação
          </button>
        </div>

        {erro && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm mb-4">
            {erro}
          </div>
        )}

        {carregandoTransacoes ? (
          <Loading />
        ) : transacoes.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p className="text-base">Nenhuma transação cadastrada ainda.</p>
            <p className="text-sm mt-2">Clique em "Nova Transação" para começar.</p>
          </div>
        ) : (
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Descrição</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Pessoa</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Categoria</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Tipo</th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Valor</th>
                  <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Ações</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {transacoes.map((transacao) => (
                  <tr key={transacao.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4">{transacao.descricao}</td>
                    <td className="py-4 px-4">{obterNomePessoa(transacao.pessoaId)}</td>
                    <td className="py-4 px-4">{obterNomeCategoria(transacao.categoriaId)}</td>

                    <td className="py-4 px-4">
                      <span
                        className={`px-3 py-1 rounded-md text-xs font-semibold ${transacao.tipo === ETipoTransacao.Receita
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                          }`}
                      >
                        {obterTextoTipoTransacao(transacao.tipo)}
                      </span>
                    </td>

                    <td
                      className={`py-4 px-4 text-right font-bold ${transacao.tipo === ETipoTransacao.Receita
                        ? 'text-green-600'
                        : 'text-red-600'
                        }`}
                    >
                      {formatarMoeda(transacao.valor)}
                    </td>

                    <td className="py-4 px-4 text-center">
                      <button
                        onClick={() => setTransacaoParaExcluir(transacao.id)}
                        className="p-2 rounded-lg hover:bg-red-50 text-gray-600 hover:text-red-600"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Versão Mobile da Tabela */}
        <div className="md:hidden flex flex-col gap-3">
          {transacoes.map((transacao) => (
            <div
              key={transacao.id}
              className="bg-white rounded-xl shadow p-4 flex justify-between items-center"
            >
              <div className="flex flex-col gap-1">
                <span className="font-semibold text-gray-900">
                  {transacao.descricao}
                </span>

                <span className="text-xs text-gray-500">
                  {obterNomePessoa(transacao.pessoaId)} •{' '}
                  {obterNomeCategoria(transacao.categoriaId)}
                </span>

                <span
                  className={`text-sm font-bold ${transacao.tipo === ETipoTransacao.Receita
                    ? 'text-green-600'
                    : 'text-red-600'
                    }`}
                >
                  {formatarMoeda(transacao.valor)}
                </span>
              </div>

              <div className="flex flex-col items-end gap-2">
                <span
                  className={`px-2 py-1 rounded-md text-xs font-semibold ${transacao.tipo === ETipoTransacao.Receita
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                    }`}
                >
                  {obterTextoTipoTransacao(transacao.tipo)}
                </span>

                <button
                  onClick={() => handleDelete(transacao.id)}
                  className="p-2 rounded-lg hover:bg-red-50 text-gray-500 hover:text-red-600"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </Card>



      {/* Modal de Nova Transação */}
      <Modal isOpen={modalAberto} onClose={() => setModalAberto(false)} title="Nova Transação">
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
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-sm focus:border-purple-600 focus:outline-none transition-colors duration-200"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Pessoa *</label>
                <select
                  required
                  value={formData.pessoaId}
                  onChange={(e) => setFormData({ ...formData, pessoaId: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-sm focus:border-purple-600 focus:outline-none transition-colors duration-200 cursor-pointer"
                >
                  <option value="">Selecione...</option>
                  {pessoas.map((pessoa) => (
                    <option key={pessoa.id} value={pessoa.id}>
                      {pessoa.nome} ({pessoa.idade} anos)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Tipo *</label>
                <select
                  required
                  value={formData.tipo}
                  onChange={(e) => setFormData({
                    ...formData,
                    tipo: Number(e.target.value) as ETipoTransacao,
                    categoriaId: ''
                  })}
                  disabled={ehMenor}
                  className={`w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-sm focus:border-purple-600 focus:outline-none transition-colors duration-200 ${ehMenor ? 'bg-gray-100 cursor-not-allowed opacity-60' : 'cursor-pointer'
                    }`}
                >
                  <option value={ETipoTransacao.Despesa}>Despesa</option>
                  <option value={ETipoTransacao.Receita}>Receita</option>
                </select>
                {ehMenor && (
                  <p className="text-xs text-orange-600 mt-1">Menores de idade só podem ter despesas</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Valor *</label>
                <input
                  type="number"
                  required
                  min="0.01"
                  step="0.01"
                  value={formData.valor || ''}
                  onChange={(e) => setFormData({ ...formData, valor: Number(e.target.value) })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-sm focus:border-purple-600 focus:outline-none transition-colors duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Categoria *</label>
                <select
                  required
                  value={formData.categoriaId}
                  onChange={(e) => setFormData({ ...formData, categoriaId: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-sm focus:border-purple-600 focus:outline-none transition-colors duration-200 cursor-pointer"
                >
                  <option value="">Selecione...</option>
                  {categoriasDisponiveis.map((categoria) => (
                    <option key={categoria.id} value={categoria.id}>
                      {categoria.descricao}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-3 justify-end mt-2">
              <button
                type="button"
                onClick={() => setModalAberto(false)}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-200 transition-colors duration-200"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-purple-900 text-white rounded-lg text-sm font-semibold hover:shadow-lg hover:shadow-purple-500/30 hover:-translate-y-0.5 transition-all duration-200"
              >
                Criar Transação
              </button>
            </div>
          </div>
        </form>
      </Modal>

      <ModalDelete
        open={!!transacaoParaExcluir}
        onClose={() => setTransacaoParaExcluir(null)}
        onConfirm={async () => {
          await deletarTransacao(transacaoParaExcluir!);
          setTransacaoParaExcluir(null);
        }}
        titulo="Excluir transação"
        descricao={
          <>
            Tem certeza que deseja excluir esta transação?
            <span className="block text-red-600 font-semibold mt-1">
              Essa ação não pode ser desfeita.
            </span>
          </>
        }
        carregando={carregandoTransacoes}
      />
    </div>
  );
};
