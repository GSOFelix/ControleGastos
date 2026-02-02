using ControleGastos.Application.Dtos;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ControleGastos.Application.Validators
{
    public class TransacaoValidator : AbstractValidator<TransacaoDto.TransacaoRequest>
    {
        public TransacaoValidator()
        {
            RuleFor(x => x.Descricao)
                .NotEmpty().WithMessage("A descrição é obrigatória.")
                .MaximumLength(400).WithMessage("A descrição deve ter no máximo 400 caracteres.");

            RuleFor(x => x.Valor)
                .GreaterThan(0)
                .WithMessage("O valor deve ser maior que zero.");

            RuleFor(x => x.Tipo)
                .IsInEnum()
                .WithMessage("Tipo de transação inválido.");

            RuleFor(x => x.CategoriaId)
                .NotEmpty()
                .WithMessage("A categoria é obrigatória.");

            RuleFor(x => x.PessoaId)
                .NotEmpty()
                .WithMessage("A pessoa é obrigatória.");
        }


    }
}
