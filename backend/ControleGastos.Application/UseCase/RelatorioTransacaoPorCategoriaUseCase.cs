using ControleGastos.Application.Dtos;
using ControleGastos.Application.Queries;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ControleGastos.Application.UseCase
{
    /// <summary>
    /// Caso de uso responsável por gerar o relatório de transações agrupadas por categoria.
    ///
    /// Aqui não existe regra de negócio complexa.
    /// A responsabilidade é apenas delegar a consulta para a camada de Query,
    /// que já retorna os dados agregados (totais e saldos).
    ///
    /// Separei como UseCase para manter um ponto de entrada claro na aplicação,
    /// evitando que controllers acessem queries diretamente.
    /// Assim mantenho a arquitetura organizada e desacoplada.
    /// </summary>
    public class RelatorioTransacaoPorCategoriaUseCase
    {
        private readonly ISaldoQuery _saldoQuery;

        public RelatorioTransacaoPorCategoriaUseCase(ISaldoQuery saldoQuery)
        {
            _saldoQuery = saldoQuery;
        }


        /// <summary>
        /// Retorna o resumo financeiro por categoria contendo:
        /// - total de receitas
        /// - total de despesas
        /// - saldo líquido
        ///
        /// O cálculo é feito na query (banco) por performance,
        /// evitando carregar todas as transações para memória.
        /// </summary>
        public async Task<TransacoesTotaisCategoriaDto.RelatorioCategoriaResponse> RelatorioCategoriaResponse(CancellationToken token)
        {
            return await _saldoQuery.ObterResumoSaldoCategoriaAsync(token);
        }
    }

}
