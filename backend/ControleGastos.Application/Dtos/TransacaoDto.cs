using ControleGastos.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ControleGastos.Application.Dtos
{
    public static class TransacaoDto
    {
        public record TransacaoRequest(
            string Descricao,
            decimal Valor,
            ETipoTransacao Tipo,
            Guid PessoaId,
            Guid CategoriaId
            );

        public record TransacaoResponse (
            Guid Id,
            string Descricao,
            decimal Valor,
            ETipoTransacao Tipo,
            Guid PessoaId,
            Guid CategoriaId
            );
    }
}
