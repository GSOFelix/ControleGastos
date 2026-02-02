using ControleGastos.Application.Dtos;
using ControleGastos.Application.Mappers;
using ControleGastos.Domain.Interfaces;
using ControleGastos.Shared.Exceptions;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ControleGastos.Application.Service
{
    /// <summary>
    /// Serviço responsável pelos casos de uso de Categoria.
    /// 
    /// Aqui fica a orquestração da aplicação:
    /// - valida entrada (DTO)
    /// - chama repositório
    /// - aplica regras necessárias
    /// - converte Entity <-> DTO
    /// 
    /// Não acessa banco diretamente (usa repository)
    /// e não contém regras complexas de domínio (ficam na entidade).
    /// </summary>
    public class CategoriaService
    {
        private readonly ICategoriaRepository _repository;
        private readonly IValidator<CategoriaDto.CategoriaRequest> _validator;

        public CategoriaService(
            ICategoriaRepository repository,
            IValidator<CategoriaDto.CategoriaRequest> validator)
        {
            _repository = repository;
            _validator = validator;
        }


        /// <summary>
        /// Cria uma nova categoria.
        /// Primeiro valida o DTO, depois converte para entidade
        /// e persiste no banco através do repositório.
        /// </summary>
        public async Task CreateCategoria(CategoriaDto.CategoriaRequest request, CancellationToken token)
        {
            var result = await _validator.ValidateAsync(request, token);

            if (!result.IsValid)
                throw new ValidationException(result.Errors);

            await _repository.CreateAsync(request.ToEntity(), token);
        }


        /// <summary>
        /// Atualiza uma categoria existente.
        /// 
        /// Fluxo:
        /// 1 - valida entrada
        /// 2 - busca entidade no banco
        /// 3 - aplica alteração na própria entidade
        /// 4 - salva via repositório
        /// </summary>
        public async Task UpdateCategoria(Guid id, CategoriaDto.CategoriaRequest request, CancellationToken token)
        {
            var result = await _validator.ValidateAsync(request, token);

            if (!result.IsValid)
                throw new ValidationException(result.Errors);

            var categoria = await _repository.GetByIdAsync(id, token)
                ?? throw new NotFoundException("Categoria não cadastrada");

            // alteração controlada pela própria entidade
            categoria.Atulizar(request.Descricao, request.Finalidade);

            await _repository.UpdateAsync(categoria, token);
        }


        /// <summary>
        /// Remove uma categoria pelo Id.
        /// Lança exceção caso não exista.
        /// </summary>
        public async Task DeleteCategoria(Guid id, CancellationToken token)
        {
            var categoria = await _repository.GetByIdAsync(id, token)
                ?? throw new NotFoundException("Categoria não cadastrada");

            await _repository.DeleteAsync(categoria, token);
        }


        /// <summary>
        /// Retorna uma categoria específica convertida para DTO.
        /// </summary>
        public async Task<CategoriaDto.CategoriaResponse> GetCategoria(Guid id, CancellationToken token)
        {
            var categoria = await _repository.GetByIdAsync(id, token)
                ?? throw new NotFoundException("Categoria não cadastrada");

            return categoria.ToDto();
        }


        /// <summary>
        /// Retorna todas as categorias cadastradas.
        /// Converte a lista de entidades para DTOs antes de devolver.
        /// </summary>
        public async Task<IReadOnlyCollection<CategoriaDto.CategoriaResponse>> GetAllCategoria(CancellationToken token)
        {
            var categorias = await _repository.GetAllAsync(token);

            return [.. categorias.Select(c => c.ToDto())];
        }
    }

}
