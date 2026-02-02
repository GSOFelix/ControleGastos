using ControleGastos.Application.Dtos;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ControleGastos.Application.Validators
{
    public class PessoaValidator : AbstractValidator<PessoaDto.PessoaRequest>
    {
        public PessoaValidator()
        {
            RuleFor(x => x.Nome)
                .NotEmpty().WithMessage("O nome é obrigatório.")
                .MinimumLength(3).WithMessage("O nome deve ter no mínimo 3 caracteres.")
                .MaximumLength(200).WithMessage("O nome deve ter no máximo 200 caracteres.");

            RuleFor(x => x.Idade)
                .GreaterThanOrEqualTo(1).WithMessage("A idade deve ser maior ou igual a 1.")
                .LessThan(130).WithMessage("A idade deve ser menor que 130.");

        }
    }


}
