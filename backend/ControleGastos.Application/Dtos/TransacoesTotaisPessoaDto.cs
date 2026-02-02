using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ControleGastos.Application.Dtos
{
    public static class TransacoesTotaisPessoaDto
    {
        public record RelatorioPessoaItem(
            Guid Id,
            string Nome,
            decimal TotalReceita,
            decimal TotalDespesa,
            decimal Saldo);

        public record RelatorioPessoaResponse(
            IReadOnlyCollection<RelatorioPessoaItem> Pessoas,
            decimal TotalReceitas,
            decimal TotalDespesas,
            decimal SaldoLiquido);
    }
}
