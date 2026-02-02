using ControleGastos.Application.Dtos;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ControleGastos.Application.Validators
{
    public class CategoriaValidator : AbstractValidator<CategoriaDto.CategoriaRequest>
    {
        public CategoriaValidator()
        {
            RuleFor(x => x.Descricao)
                .NotEmpty().WithMessage("A descrição é obrigatória.")
                .MaximumLength(400).WithMessage("A descrição deve ter no máximo 400 caracteres.");

            RuleFor(x => x.Finalidade)
                .IsInEnum()
                .WithMessage("Finalidade inválida. Informe Receita ou Despesa.");

        }
    }
}
