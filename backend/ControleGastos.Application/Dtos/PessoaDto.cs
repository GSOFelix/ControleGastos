using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ControleGastos.Application.Dtos
{
    public static class PessoaDto
    {
        public record PessoaRequest(string Nome ,int Idade);
        public record PessoaResponse(Guid Id, string Nome ,int Idade);
    }
}
