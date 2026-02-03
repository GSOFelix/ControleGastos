import { useState } from 'react';
import { Users, Tag, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { Card } from '../components/Card';
import { Loading } from '../components/Loading';
import { useTransacoes } from '../hooks/useTransacoes';
import { formatarMoeda } from '../utils/formatters';

export const Relatorios = () => {
  const {
    relatorioPessoa,
    relatorioCategoria,
    carregando,
    erro,
    buscarRelatorioPessoa,
    buscarRelatorioCategoria,
  } = useTransacoes();

  const [tipoRelatorio, setTipoRelatorio] = useState<'pessoa' | 'categoria' | null>(null);

  const handleBuscarRelatorio = async (tipo: 'pessoa' | 'categoria') => {
    setTipoRelatorio(tipo);
    if (tipo === 'pessoa') {
      await buscarRelatorioPessoa();
    } else {
      await buscarRelatorioCategoria();
    }
  };

  return (
    <div>
      {/* Seletor de Tipo de Relatório */}
      {!tipoRelatorio && (
        <div>
          <h2 className="text-2xl font-bold text-white text-center mb-6">
            Escolha o tipo de relatório
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card hover>
              <div
                onClick={() => handleBuscarRelatorio('pessoa')}
                className="cursor-pointer text-center p-6"
              >
                <div className="w-18 h-18 bg-gradient-to-br from-purple-600 to-purple-900 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-purple-500/30">
                  <Users size={36} className="text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Relatório por Pessoa</h3>
                <p className="text-sm text-gray-600">
                  Visualize totais de receitas, despesas e saldo de cada pessoa cadastrada
                </p>
              </div>
            </Card>

            <Card hover>
              <div
                onClick={() => handleBuscarRelatorio('categoria')}
                className="cursor-pointer text-center p-6"
              >
                <div className="w-18 h-18 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-green-500/30">
                  <Tag size={36} className="text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Relatório por Categoria</h3>
                <p className="text-sm text-gray-600">
                  Visualize totais de receitas, despesas e saldo de cada categoria cadastrada
                </p>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Relatório por Pessoa */}
      {tipoRelatorio === 'pessoa' && (
        <Card>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-900 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30">
                <Users size={24} className="text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Relatório por Pessoa</h2>
            </div>
            <button
              onClick={() => setTipoRelatorio(null)}
              className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-200 transition-colors duration-200"
            >
              Voltar
            </button>
          </div>

          {erro && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm mb-4">
              {erro}
            </div>
          )}

          {carregando ? (
            <Loading />
          ) : !relatorioPessoa ? (
            <div className="text-center py-12 text-gray-400">
              <p className="text-base">Nenhum dado disponível</p>
            </div>
          ) : (
            <>
              {/* Tabela de Pessoas */}
              <div className="hidden md:block mb-8 overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Nome</th>
                      <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Receitas</th>
                      <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Despesas</th>
                      <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Saldo</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {relatorioPessoa.pessoas.map((pessoa) => (
                      <tr key={pessoa.id}>
                        <td className="py-4 px-4 font-semibold">{pessoa.nome}</td>
                        <td className="py-4 px-4 text-right text-green-600">
                          {formatarMoeda(pessoa.totalReceita)}
                        </td>
                        <td className="py-4 px-4 text-right text-red-600">
                          {formatarMoeda(pessoa.totalDespesa)}
                        </td>
                        <td className={`py-4 px-4 text-right font-bold ${pessoa.saldo >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                          {formatarMoeda(pessoa.saldo)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* MOBILE → Cards */}
              <div className="md:hidden space-y-3">
                {relatorioPessoa.pessoas.map((pessoa) => (
                  <div
                    key={pessoa.id}
                    className="p-4 bg-white rounded-xl shadow border border-gray-200"
                  >
                    <p className="font-bold text-gray-900 mb-3">{pessoa.nome}</p>

                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-gray-500">Receitas</p>
                        <p className="text-green-600 font-semibold">
                          {formatarMoeda(pessoa.totalReceita)}
                        </p>
                      </div>

                      <div>
                        <p className="text-gray-500">Despesas</p>
                        <p className="text-red-600 font-semibold">
                          {formatarMoeda(pessoa.totalDespesa)}
                        </p>
                      </div>

                      <div className="col-span-2 mt-2">
                        <p className="text-gray-500">Saldo</p>
                        <p className={`text-lg font-bold ${pessoa.saldo >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                          {formatarMoeda(pessoa.saldo)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totais Gerais */}
              <div className="flex flex-col md:grid md:grid-cols-3 gap-3 mt-4 md:gap-4 p-4 md:p-6 bg-gray-50 rounded-xl border border-gray-200">

                <div className="bg-white rounded-lg p-4 shadow-sm text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <TrendingUp size={18} className="text-green-600" />
                    <p className="text-xs font-semibold text-gray-500 uppercase">Receitas</p>
                  </div>
                  <p className="text-xl md:text-2xl font-bold text-green-600">
                    {formatarMoeda(relatorioPessoa.totalReceitas)}
                  </p>
                </div>

                <div className="bg-white rounded-lg p-4 shadow-sm text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <TrendingDown size={18} className="text-red-600" />
                    <p className="text-xs font-semibold text-gray-500 uppercase">Despesas</p>
                  </div>
                  <p className="text-xl md:text-2xl font-bold text-red-600">
                    {formatarMoeda(relatorioPessoa.totalDespesas)}
                  </p>
                </div>

                <div className="bg-white rounded-lg p-4 shadow-sm text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <DollarSign size={18} />
                    <p className="text-xs font-semibold text-gray-500 uppercase">Saldo</p>
                  </div>
                  <p className={`text-xl md:text-2xl font-bold ${relatorioPessoa.saldoLiquido >= 0 ? 'text-purple-600' : 'text-orange-600'
                    }`}>
                    {formatarMoeda(relatorioPessoa.saldoLiquido)}
                  </p>
                </div>

              </div>
            </>
          )}
        </Card>
      )}

      {/* Relatório por Categoria */}
      {tipoRelatorio === 'categoria' && (
        <Card>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/30">
                <Tag size={24} className="text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Relatório por Categoria</h2>
            </div>
            <button
              onClick={() => setTipoRelatorio(null)}
              className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-200 transition-colors duration-200"
            >
              Voltar
            </button>
          </div>

          {erro && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm mb-4">
              {erro}
            </div>
          )}

          {carregando ? (
            <Loading />
          ) : !relatorioCategoria ? (
            <div className="text-center py-12 text-gray-400">
              <p className="text-base">Nenhum dado disponível</p>
            </div>
          ) : (
            <>
              {/* Tabela de Categorias */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Categoria</th>
                      <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Receitas</th>
                      <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Despesas</th>
                      <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Saldo</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {relatorioCategoria.categoria.map((cat) => (
                      <tr key={cat.id} className="hover:bg-gray-50 transition-colors duration-150">
                        <td className="py-4 px-4 text-sm font-semibold text-gray-900">{cat.descricao}</td>
                        <td className="py-4 px-4 text-right text-sm font-semibold text-green-600">
                          {formatarMoeda(cat.totalReceita)}
                        </td>
                        <td className="py-4 px-4 text-right text-sm font-semibold text-red-600">
                          {formatarMoeda(cat.totalDespesa)}
                        </td>
                        <td className={`py-4 px-4 text-right text-base font-bold ${cat.saldo >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                          {formatarMoeda(cat.saldo)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* MOBILE */}
              <div className="md:hidden space-y-3">
                {relatorioCategoria.categoria.map((cat) => (
                  <div key={cat.id} className="p-4 bg-white rounded-xl shadow border">
                    <p className="font-bold mb-2">{cat.descricao}</p>

                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-gray-500">Receitas</p>
                        <p className="text-green-600 font-semibold">
                          {formatarMoeda(cat.totalReceita)}
                        </p>
                      </div>

                      <div>
                        <p className="text-gray-500">Despesas</p>
                        <p className="text-red-600 font-semibold">
                          {formatarMoeda(cat.totalDespesa)}
                        </p>
                      </div>

                      <div className="col-span-2">
                        <p className="text-gray-500">Saldo</p>
                        <p className={`font-bold ${cat.saldo >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                          {formatarMoeda(cat.saldo)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totais Gerais */}
              <div className="flex flex-col md:grid md:grid-cols-3 gap-3 md:gap-4 p-4 md:p-6 bg-gray-50 rounded-xl border border-gray-200">

                {/* Receitas */}
                <div className="bg-white rounded-lg p-4 shadow-sm text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <TrendingUp size={18} className="text-green-600" />
                    <p className="text-xs font-semibold text-gray-500 uppercase">
                      Receitas
                    </p>
                  </div>

                  <p className="text-xl md:text-2xl font-bold text-green-600">
                    {formatarMoeda(relatorioCategoria.totalReceitas)}
                  </p>
                </div>


                {/* Despesas */}
                <div className="bg-white rounded-lg p-4 shadow-sm text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <TrendingDown size={18} className="text-red-600" />
                    <p className="text-xs font-semibold text-gray-500 uppercase">
                      Despesas
                    </p>
                  </div>

                  <p className="text-xl md:text-2xl font-bold text-red-600">
                    {formatarMoeda(relatorioCategoria.totalDespesas)}
                  </p>
                </div>


                {/* Saldo */}
                <div className="bg-white rounded-lg p-4 shadow-sm text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <DollarSign
                      size={18}
                      className={relatorioCategoria.saldoLiquido >= 0 ? 'text-purple-600' : 'text-orange-600'}
                    />
                    <p className="text-xs font-semibold text-gray-500 uppercase">
                      Saldo
                    </p>
                  </div>

                  <p
                    className={`text-xl md:text-2xl font-bold ${relatorioCategoria.saldoLiquido >= 0 ? 'text-purple-600' : 'text-orange-600'
                      }`}
                  >
                    {formatarMoeda(relatorioCategoria.saldoLiquido)}
                  </p>
                </div>

              </div>
            </>
          )}
        </Card>
      )}
    </div>
  );
};
