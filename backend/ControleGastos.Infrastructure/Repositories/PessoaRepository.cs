using ControleGastos.Domain.Entities;
using ControleGastos.Domain.Interfaces;
using ControleGastos.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ControleGastos.Infrastructure.Repositories
{
    /// <summary>
    /// Implementação do repositório de Pessoa utilizando EF Core.
    /// 
    /// Essa classe é responsável somente pelo acesso e persistência dos dados.
    /// Nenhuma regra de negócio deve ser implementada aqui.
    /// 
    /// A aplicação depende da interface (IPessoaRepository)
    /// para manter o domínio desacoplado da camada de infraestrutura.
    /// </summary>
    public class PessoaRepository : IPessoaRepository
    {
        private readonly AppDbContext _context;

        public PessoaRepository(AppDbContext context)
        {
            _context = context;
        }


        /// <summary>
        /// Persiste uma nova pessoa no banco de dados.
        /// </summary>
        public async Task CreateAsync(Pessoa pessoa, CancellationToken token)
        {
            await _context.Pessoas.AddAsync(pessoa, token);
            await _context.SaveChangesAsync(token);
        }


        /// <summary>
        /// Remove a pessoa informada do banco.
        /// 
        /// Caso existam relacionamentos (ex: transações),
        /// o comportamento é controlado pelas configurações do EF/relacionamentos.
        /// </summary>
        public async Task DeleteAsync(Pessoa pessoa, CancellationToken token)
        {
            _context.Pessoas.Remove(pessoa);
            await _context.SaveChangesAsync(token);
        }


        /// <summary>
        /// Retorna todas as pessoas cadastradas.
        /// Consulta direta ao banco sem regras de negócio.
        /// </summary>
        public async Task<IReadOnlyList<Pessoa>> GetAllAsync(CancellationToken token)
        {
            return await _context.Pessoas.ToListAsync(token);
        }


        /// <summary>
        /// Busca uma pessoa pelo Id.
        /// Retorna null caso não exista registro.
        /// </summary>
        public async Task<Pessoa?> GetByIdAsync(Guid id, CancellationToken token)
        {
            return await _context.Pessoas
                .FirstOrDefaultAsync(x => x.Id == id, token);
        }


        /// <summary>
        /// Atualiza os dados da pessoa.
        /// O Entity Framework faz o controle de tracking automaticamente.
        /// </summary>
        public async Task UpdateAsync(Pessoa pessoa, CancellationToken token)
        {
            _context.Pessoas.Update(pessoa);
            await _context.SaveChangesAsync(token);
        }
    }
}
