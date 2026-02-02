using ControleGastos.Domain.Enums;
using ControleGastos.Domain.Exceptions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ControleGastos.Domain.Entities
{
    /// <summary>
    /// Representa uma categoria financeira (ex: Alimentação, Salário, Lazer).
    /// 
    /// A categoria define a finalidade das transações permitidas:
    /// Receita, Despesa ou Ambas.
    /// 
    /// Regras de negócio e validações ficam concentradas aqui
    /// para manter a integridade do domínio.
    /// </summary>
    public class Categoria
    {
        public Guid Id { get; private set; } = Guid.NewGuid();
        public string Descricao { get; private set; } = string.Empty;
        public EFinalidadeCategoria Finalidade { get; private set; }

        public IReadOnlyCollection<Transacao> Transacoes => _transacoes;
        private readonly List<Transacao> _transacoes = new();

        public Categoria() { }

        /// <summary>
        /// Cria uma nova categoria já garantindo as regras básicas do domínio.
        /// </summary>
        public Categoria(string descricao, EFinalidadeCategoria finalidade)
        {
            DomainExceptions.When(
                string.IsNullOrEmpty(descricao),
                "Descrição é obrigatorio");

            DomainExceptions.When(
                descricao.Length > 400,
                "Descrição deve ter no máximo 400 caracteres.");

            Descricao = descricao;
            Finalidade = finalidade;
        }

        /// <summary>
        /// Atualiza os dados da categoria.
        /// Mantém a mesma lógica de validação aplicada na criação.
        /// </summary>
        public void Atulizar(string descricao, EFinalidadeCategoria finalidade)
        {
            DomainExceptions.When(string.IsNullOrEmpty(descricao), "Descrição é obrigatorio");
            DomainExceptions.When(descricao.Length > 400, "Descrição deve ter no máximo 400 caracteres.");
            Descricao = descricao;
            Finalidade = finalidade;
        }

    }
}
