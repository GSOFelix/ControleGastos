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
    /// Caso de uso responsável por gerar o relatório de transações agrupadas por pessoa.
    ///
    /// Esse UseCase atua apenas como orquestrador da consulta.
    /// Ele delega a responsabilidade de agregação (somas e saldo)
    /// para a camada de Query, que executa os cálculos direto no banco.
    ///
    /// Dessa forma:
    /// - evito carregar todas as transações para memória
    /// - ganho performance
    /// - mantenho o controller desacoplado da infraestrutura
    /// - concentro a lógica de leitura em um único ponto
    /// </summary>
    public class RelatorioTransacaoPorPessoaUseCase
    {
        private readonly ISaldoQuery _saldoQuery;

        public RelatorioTransacaoPorPessoaUseCase(ISaldoQuery saldoQuery)
        {
            _saldoQuery = saldoQuery;
        }

        /// <summary>
        /// Retorna o resumo financeiro por pessoa contendo:
        /// - total de receitas
        /// - total de despesas
        /// - saldo líquido
        ///
        /// Os cálculos são feitos na query para melhor performance,
        /// utilizando agregações diretamente no banco de dados.
        /// </summary>
        public async Task<TransacoesTotaisPessoaDto.RelatorioPessoaResponse> RelatorioPessoaResponse(CancellationToken token)
        {
            return await _saldoQuery.ObterResumoSaldoPessoaAsync(token);
        }
    }
}
