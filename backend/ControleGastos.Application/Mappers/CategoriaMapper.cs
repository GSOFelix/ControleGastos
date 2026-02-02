using ControleGastos.Application.Dtos;
using ControleGastos.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ControleGastos.Application.Mappers
{
    public static class CategoriaMapper
    {
        public static Categoria ToEntity(this CategoriaDto.CategoriaRequest dto)
            => new Categoria(dto.Descricao, dto.Finalidade);

        public static CategoriaDto.CategoriaResponse ToDto(this Categoria entity)
            => new CategoriaDto.CategoriaResponse(entity.Id, entity.Descricao, entity.Finalidade);
    }
}
