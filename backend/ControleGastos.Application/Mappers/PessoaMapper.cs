using ControleGastos.Application.Dtos;
using ControleGastos.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ControleGastos.Application.Mappers
{
    public static class PessoaMapper
    {
        public static Pessoa ToEntity(this PessoaDto.PessoaRequest dto)
            => new Pessoa(dto.Nome, dto.Idade);

        public static PessoaDto.PessoaResponse ToDto(this Pessoa entity)
            => new PessoaDto.PessoaResponse(entity.Id,entity.Nome, entity.Idade);
    }
}
