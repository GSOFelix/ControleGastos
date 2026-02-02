using ControleGastos.Application.Dtos;
using ControleGastos.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ControleGastos.Application.Mappers
{
    public static class TransacaoMapper
    {
        public static Transacao ToEntity(this TransacaoDto.TransacaoRequest dto, Categoria categoria, Pessoa pessoa)
            => new Transacao(dto.Descricao, dto.Valor, dto.Tipo, categoria, pessoa);

        public static TransacaoDto.TransacaoResponse ToDto(this Transacao entity)
            => new TransacaoDto.TransacaoResponse(entity.Id, entity.Descricao, entity.Valor, entity.Tipo, entity.PessoaId, entity.CategoriaId);
    }
}
