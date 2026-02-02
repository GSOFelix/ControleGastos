using ControleGastos.Domain.Enums;
using ControleGastos.Domain.Exceptions;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ControleGastos.Domain.Entities
{
    /// <summary>
    /// Representa uma movimentação financeira realizada por uma pessoa.
    /// 
    /// A entidade é responsável por:
    /// - Garantir que os dados básicos sejam válidos (descrição, valor, vínculos)
    /// - Aplicar regras de negócio (menor de idade, finalidade da categoria)
    /// - Definir automaticamente a data da transação no momento da criação
    /// 
    /// Dessa forma evitamos que o sistema crie transações inválidas.
    /// </summary>
    public class Transacao
    {
        // Gerado na própria entidade para não depender do banco
        public Guid Id { get; private set; } = Guid.NewGuid();

        public string Descricao { get; private set; } = string.Empty;

        // Valor sempre positivo, o tipo (Receita/Despesa) define o sinal lógico
        public decimal Valor { get; private set; }

        public ETipoTransacao Tipo { get; private set; }


        // Relacionamento com Categoria
        public Guid CategoriaId { get; private set; }
        public Categoria Categoria { get; private set; }


        // Relacionamento com Pessoa
        public Guid PessoaId { get; private set; }
        public Pessoa Pessoa { get; private set; }


        // Data registrada automaticamente na criação
        public DateTime Data { get; private set; }


        // Necessário para o EF Core
        public Transacao() { }


        /// <summary>
        /// Cria uma nova transação já validando:
        /// 1) Regras de domínio (dados obrigatórios)
        /// 2) Regras de negócio (menor de idade / finalidade da categoria)
        /// </summary>
        public Transacao(
            string descricao,
            decimal valor,
            ETipoTransacao tipo,
            Categoria categoria,
            Pessoa pessoa)
        {
            ValidateDomain(descricao, valor, tipo, categoria, pessoa);
            BusinessValidation(tipo, categoria, pessoa);

            Descricao = descricao;
            Valor = valor;
            Tipo = tipo;

            Categoria = categoria;
            CategoriaId = categoria.Id;

            Pessoa = pessoa;
            PessoaId = pessoa.Id;

            // Sempre salva em UTC para evitar problemas de fuso horário
            Data = DateTime.UtcNow;
        }


        /// <summary>
        /// Validações estruturais da entidade.
        /// Garante que a transação nunca exista em estado inválido.
        /// </summary>
        private void ValidateDomain(
            string descricao,
            decimal valor,
            ETipoTransacao tipo,
            Categoria categoria,
            Pessoa pessoa)
        {
            DomainExceptions.When(
                string.IsNullOrWhiteSpace(descricao),
                "Descrição é obrigatória");

            DomainExceptions.When(
                descricao.Length > 400,
                "Descrição deve ter no máximo 400 caracteres.");

            DomainExceptions.When(
                valor <= 0,
                "O valor deve ser positivo");

            DomainExceptions.When(
                categoria == null,
                "Categoria é obrigatória");

            DomainExceptions.When(
                pessoa == null,
                "Pessoa é obrigatória");
        }


        /// <summary>
        /// Regras de negócio específicas do sistema financeiro.
        /// </summary>
        private void BusinessValidation(
            ETipoTransacao tipo,
            Categoria categoria,
            Pessoa pessoa)
        {
            // Menores de idade não podem registrar receitas
            DomainExceptions.When(
                pessoa.EhMenorDeIdade() && tipo == ETipoTransacao.Receita,
                "Menor de idade só pode realizar despesas");

            // Categoria deve ser compatível com o tipo da transação
            DomainExceptions.When(
                categoria.Finalidade != EFinalidadeCategoria.Ambas &&
                categoria.Finalidade != (EFinalidadeCategoria)tipo,
                "Categoria incompatível com o tipo da transação");
        }


        /// <summary>
        /// Permite atualizar apenas dados editáveis.
        /// Não permite trocar pessoa/categoria/tipo para evitar inconsistências.
        /// </summary>
        public void Atualizar(string descricao, decimal valor)
        {
            DomainExceptions.When(
                string.IsNullOrWhiteSpace(descricao),
                "Descrição é obrigatória");

            DomainExceptions.When(
                descricao.Length > 400,
                "Descrição deve ter no máximo 400 caracteres.");

            DomainExceptions.When(
                valor <= 0,
                "O valor deve ser positivo");

            Descricao = descricao;
            Valor = valor;
        }
    }
}
