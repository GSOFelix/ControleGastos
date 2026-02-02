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
    /// Serviço responsável pelos casos de uso de Transação.
    ///
    /// Aqui concentro a orquestração da aplicação:
    /// - validação dos dados de entrada (DTO)
    /// - busca e persistência via repositório
    /// - delego regras de negócio para a entidade (Transacao)
    /// - conversão Entity <-> DTO
    ///
    /// Essa camada NÃO acessa o banco diretamente.
    /// Toda comunicação com dados passa pelo ITransacaoRepository.
    /// </summary>
    public class TransacaoService
    {
        private readonly ITransacaoRepository _repository;
        private readonly IValidator<TransacaoDto.TransacaoRequest> _validator;

        public TransacaoService(
            ITransacaoRepository repository,
            IValidator<TransacaoDto.TransacaoRequest> validator)
        {
            _repository = repository;
            _validator = validator;
        }


        /// <summary>
        /// Retorna todas as transações cadastradas.
        /// Apenas consulta e converte para DTO.
        /// </summary>
        public async Task<IReadOnlyCollection<TransacaoDto.TransacaoResponse>> GetAllTransacao(CancellationToken token)
        {
            var transacoes = await _repository.GetAllAsync(token);

            return [.. transacoes.Select(t => t.ToDto())];
        }


        /// <summary>
        /// Busca uma transação específica pelo Id.
        /// Lança exceção caso não exista.
        /// </summary>
        public async Task<TransacaoDto.TransacaoResponse> GetTransacao(Guid id, CancellationToken token)
        {
            var transacao = await _repository.GetByIdAsync(id, token)
                ?? throw new NotFoundException("Transação não encontrada");

            return transacao.ToDto();
        }


        /// <summary>
        /// Atualiza uma transação existente.
        ///
        /// Fluxo:
        /// 1 - valida o DTO
        /// 2 - busca a entidade
        /// 3 - aplica as alterações via método da própria entidade
        /// 4 - salva no banco
        ///
        /// A entidade é responsável por proteger suas regras internas.
        /// </summary>
        public async Task UpdateTransacao(TransacaoDto.TransacaoRequest request, Guid id, CancellationToken token)
        {
            var result = await _validator.ValidateAsync(request, token);

            if (!result.IsValid)
                throw new ValidationException(result.Errors);

            var transacao = await _repository.GetByIdAsync(id, token)
                ?? throw new NotFoundException("Transação não encontrada");

            // a própria entidade controla a atualização dos seus dados
            transacao.Atualizar(request.Descricao, request.Valor);

            await _repository.UpdateAsync(transacao, token);
        }


        /// <summary>
        /// Remove uma transação pelo Id.
        /// </summary>
        public async Task DeleteTransacao(Guid id, CancellationToken token)
        {
            var transacao = await _repository.GetByIdAsync(id, token)
                 ?? throw new NotFoundException("Transação não encontrada");

            await _repository.DeleteAsync(transacao, token);
        }
    }
}
