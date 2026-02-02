using ControleGastos.Domain.Exceptions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ControleGastos.Domain.Entities
{
    /// <summary>
    /// Representa uma pessoa dona das transações financeiras do sistema.
    /// 
    /// A entidade é responsável por garantir sua própria consistência,
    /// validando regras básicas como nome obrigatório e idade válida.
    /// 
    /// Também expõe comportamentos de negócio, por exemplo verificar
    /// se a pessoa é menor de idade (regra usada nas transações).
    /// </summary>
    public class Pessoa
    {
        // O Id é gerado pela própria entidade para não depender do banco
        public Guid Id { get; private set; } = Guid.NewGuid();

        // Nome exibido para o usuário
        public string Nome { get; private set; } = string.Empty;

        // Idade usada em algumas regras de negócio (ex: restrições de receita)
        public int Idade { get; private set; }


        // Coleção somente leitura para evitar alterações externas
        public IReadOnlyCollection<Transacao> Transacoes => _transacoes;

        // Lista interna controlada apenas pela entidade
        private readonly List<Transacao> _transacoes = new();


        // Necessário para o EF Core materializar a entidade
        public Pessoa() { }

        /// <summary>
        /// Cria uma nova pessoa já garantindo as regras básicas do domínio.
        /// </summary>
        public Pessoa(string nome, int idade)
        {
            DomainExceptions.When(
                string.IsNullOrWhiteSpace(nome),
                "Nome é obrigatório"
            );

            DomainExceptions.When(
                nome.Length > 200,
                "Nome deve ter no máximo 200 caracteres"
            );

            DomainExceptions.When(
                idade < 0,
                "Idade não pode ser negativa"
            );

            Nome = nome;
            Idade = idade;
        }


        /// <summary>
        /// Regra de negócio utilizada para restringir determinadas operações,
        /// como impedir menores de idade de registrar receitas.
        /// </summary>
        public bool EhMenorDeIdade()
        {
            return Idade < 18;
        }


        /// <summary>
        /// Atualiza os dados da pessoa mantendo as mesmas validações da criação,
        /// garantindo que a entidade nunca fique em estado inválido.
        /// </summary>
        public void Atualizar(string nome, int idade)
        {
            DomainExceptions.When(string.IsNullOrWhiteSpace(nome), "Nome obrigatório");
            DomainExceptions.When(nome.Length > 200, "Nome muito grande");
            DomainExceptions.When(idade < 0, "Idade inválida");

            Nome = nome;
            Idade = idade;
        }
    }
}
