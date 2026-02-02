using ControleGastos.Application.Dtos;
using ControleGastos.Application.Mappers;
using ControleGastos.Domain.Entities;
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
    /// Serviço responsável pelos casos de uso relacionados à Pessoa.
    /// 
    /// Essa classe faz a orquestração da aplicação:
    /// - valida os dados recebidos (DTO)
    /// - consulta/persiste dados via repositório
    /// - delega regras de negócio para a própria entidade
    /// - converte Entity <-> DTO
    /// 
    /// Não acessa banco diretamente.
    /// Toda persistência é feita através do IPessoaRepository.
    /// </summary>
    public class PessoaService
    {
        private readonly IPessoaRepository _repository;
        private readonly IValidator<PessoaDto.PessoaRequest> _validator;

        public PessoaService(
            IPessoaRepository repository,
            IValidator<PessoaDto.PessoaRequest> validator)
        {
            _repository = repository;
            _validator = validator;
        }


        /// <summary>
        /// Cria uma nova pessoa.
        /// Primeiro valida o DTO recebido e,
        /// caso esteja válido, converte para entidade e salva no banco.
        /// </summary>
        public async Task CreatePessoa(PessoaDto.PessoaRequest request, CancellationToken token)
        {
            var result = await _validator.ValidateAsync(request, token);

            if (!result.IsValid)
                throw new ValidationException(result.Errors);

            await _repository.CreateAsync(request.ToEntity(), token);
        }


        /// <summary>
        /// Atualiza os dados de uma pessoa existente.
        /// 
        /// Fluxo:
        /// 1 - valida os dados
        /// 2 - busca no banco
        /// 3 - aplica as alterações na entidade
        /// 4 - persiste novamente
        /// </summary>
        public async Task UpdatePessoa(Guid id, PessoaDto.PessoaRequest request, CancellationToken token)
        {
            var result = await _validator.ValidateAsync(request, token);

            if (!result.IsValid)
                throw new ValidationException(result.Errors);

            var pessoa = await _repository.GetByIdAsync(id, token)
                ?? throw new NotFoundException("Pessoa não cadastrada");

            // a própria entidade controla como seus dados podem ser alterados
            pessoa.Atualizar(request.Nome, request.Idade);

            await _repository.UpdateAsync(pessoa, token);
        }


        /// <summary>
        /// Remove uma pessoa pelo identificador.
        /// Lança exceção caso o registro não exista.
        /// </summary>
        public async Task DeletePessoa(Guid id, CancellationToken token)
        {
            var pessoa = await _repository.GetByIdAsync(id, token)
                ?? throw new NotFoundException("Pessoa não cadastrada");

            await _repository.DeleteAsync(pessoa, token);
        }


        /// <summary>
        /// Retorna uma pessoa específica convertida para DTO.
        /// Usado para consultas individuais.
        /// </summary>
        public async Task<PessoaDto.PessoaResponse> GetPessoa(Guid id, CancellationToken token)
        {
            var pessoa = await _repository.GetByIdAsync(id, token)
                ?? throw new NotFoundException("Pessoa não cadastrada");

            return pessoa.ToDto();
        }


        /// <summary>
        /// Retorna todas as pessoas cadastradas.
        /// Converte a lista de entidades para DTO antes de retornar para a API.
        /// </summary>
        public async Task<IReadOnlyCollection<PessoaDto.PessoaResponse>> GetAllPessoas(CancellationToken token)
        {
            var pessoas = await _repository.GetAllAsync(token);

            return [.. pessoas.Select(p => p.ToDto())];
        }
    }

}
