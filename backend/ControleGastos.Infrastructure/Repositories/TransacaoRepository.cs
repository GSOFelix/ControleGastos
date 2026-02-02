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
    /// Implementação do repositório de Transação utilizando EF Core.
    /// 
    /// Essa classe é responsável apenas por operações de persistência (CRUD).
    /// Não contém regras de negócio, apenas acesso ao banco de dados.
    /// 
    /// As validações e regras ficam na entidade de domínio (Transacao),
    /// mantendo a separação entre domínio e infraestrutura.
    /// </summary>
    public class TransacaoRepository : ITransacaoRepository
    {
        private readonly AppDbContext _context;

        public TransacaoRepository(AppDbContext context)
        {
            _context = context;
        }


        /// <summary>
        /// Persiste uma nova transação no banco.
        /// O EF passa a rastrear a entidade após o AddAsync.
        /// </summary>
        public async Task CreateAsync(Transacao transacao, CancellationToken token)
        {
            await _context.Transacoes.AddAsync(transacao, token);
            await _context.SaveChangesAsync(token);
        }


        /// <summary>
        /// Atualiza os dados da transação.
        /// O EF controla o tracking e envia apenas as alterações para o banco.
        /// </summary>
        public async Task UpdateAsync(Transacao transacao, CancellationToken token)
        {
            _context.Transacoes.Update(transacao);
            await _context.SaveChangesAsync(token);
        }


        /// <summary>
        /// Remove a transação informada do banco.
        /// A integridade referencial é tratada pelos relacionamentos configurados no EF.
        /// </summary>
        public async Task DeleteAsync(Transacao transacao, CancellationToken token)
        {
            _context.Transacoes.Remove(transacao);
            await _context.SaveChangesAsync(token);
        }


        /// <summary>
        /// Retorna todas as transações cadastradas.
        /// 
        /// Utilizo AsNoTracking pois é uma consulta somente leitura,
        /// melhorando performance e reduzindo uso de memória.
        /// </summary>
        public async Task<IReadOnlyList<Transacao>> GetAllAsync(CancellationToken token)
        {
            return await _context.Transacoes
                .AsNoTracking()
                .ToListAsync(token);
        }


        /// <summary>
        /// Busca uma transação pelo identificador.
        /// Retorna null caso não exista.
        /// 
        /// Também utiliza AsNoTracking por ser apenas leitura.
        /// </summary>
        public async Task<Transacao?> GetByIdAsync(Guid id, CancellationToken token)
        {
            return await _context.Transacoes
                .AsNoTracking()
                .FirstOrDefaultAsync(x => x.Id == id, token);
        }
    }

}
