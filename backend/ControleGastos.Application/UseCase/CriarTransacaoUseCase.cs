using ControleGastos.Application.Dtos;
using ControleGastos.Application.Mappers;
using ControleGastos.Application.Service;
using ControleGastos.Domain.Interfaces;
using ControleGastos.Shared.Exceptions;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ControleGastos.Application.UseCase
{
    /// <summary>
    /// Caso de uso responsável pela criação de uma nova Transação.
    ///
    /// Separei esse fluxo em um UseCase específico pois a criação
    /// envolve mais regras e dependências do que um simples CRUD:
    /// - validação do DTO
    /// - busca da Categoria
    /// - busca da Pessoa
    /// - aplicação das regras de negócio da entidade Transacao
    /// - persistência
    ///
    /// Dessa forma mantenho o Service mais simples e concentro
    /// a orquestração desse processo aqui.
    /// </summary>
    public class CriarTransacaoUseCase
    {
        private readonly ITransacaoRepository _repository;
        private readonly ICategoriaRepository _categoriaRepository;
        private readonly IPessoaRepository _pessoaRepository;
        private readonly IValidator<TransacaoDto.TransacaoRequest> _validator;

        public CriarTransacaoUseCase(
            ITransacaoRepository repository,
            ICategoriaRepository categoriaRepository,
            IPessoaRepository pessoaRepository,
            IValidator<TransacaoDto.TransacaoRequest> validator
        )
        {
            _repository = repository;
            _categoriaRepository = categoriaRepository;
            _pessoaRepository = pessoaRepository;
            _validator = validator;
        }


        /// <summary>
        /// Cria uma nova transação.
        ///
        /// Fluxo:
        /// 1 - valida os dados recebidos
        /// 2 - garante que Categoria e Pessoa existem
        /// 3 - cria a entidade aplicando regras do domínio
        /// 4 - persiste no banco
        ///
        /// Toda regra de negócio permanece dentro da entidade Transacao,
        /// aqui apenas orquestro o processo.
        /// </summary>
        public async Task CreateTransacao(TransacaoDto.TransacaoRequest request, CancellationToken token)
        {
            var result = await _validator.ValidateAsync(request, token);

            if (!result.IsValid)
                throw new ValidationException(result.Errors);

            // garante integridade referencial antes de criar a transação
            var categoria = await _categoriaRepository.GetByIdAsync(request.CategoriaId, token)
                ?? throw new NotFoundException("Categoria não encontrada");

            var pessoa = await _pessoaRepository.GetByIdAsync(request.PessoaId, token)
                ?? throw new NotFoundException("Pessoa não encontrada");

            // a entidade é criada já validando suas próprias regras internas
            var transacao = request.ToEntity(categoria, pessoa);

            await _repository.CreateAsync(transacao, token);
        }
    }

}
