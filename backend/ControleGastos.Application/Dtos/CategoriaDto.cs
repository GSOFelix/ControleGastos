using ControleGastos.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ControleGastos.Application.Dtos
{
    public static class CategoriaDto
    {
        public record CategoriaRequest(string Descricao, EFinalidadeCategoria Finalidade);
        public record CategoriaResponse(Guid Id, string descricao, EFinalidadeCategoria FinalidadeCategoria);
    }
}
