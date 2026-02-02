using ControleGastos.Application.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ControleGastos.Application.Queries
{
    public interface ISaldoQuery
    {
        Task<TransacoesTotaisPessoaDto.RelatorioPessoaResponse> ObterResumoSaldoPessoaAsync(CancellationToken token);
        Task<TransacoesTotaisCategoriaDto.RelatorioCategoriaResponse> ObterResumoSaldoCategoriaAsync(CancellationToken token);
    }
}
