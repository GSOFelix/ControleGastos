using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ControleGastos.Application.Dtos
{
    public static class TransacoesTotaisCategoriaDto
    {
        public record RelatorioCategoriaItem(
            Guid Id,
            string Descricao,
            decimal TotalReceita,
            decimal TotalDespesa,
            decimal Saldo);

        public record RelatorioCategoriaResponse(
            IReadOnlyCollection<RelatorioCategoriaItem> Categoria,
            decimal TotalReceitas,
            decimal TotalDespesas,
            decimal SaldoLiquido);
    }
}
