using ControleGastos.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ControleGastos.Domain.Interfaces
{
    public interface ITransacaoRepository
    {
        Task CreateAsync(Transacao transacao, CancellationToken token);
        Task UpdateAsync(Transacao transacao, CancellationToken token);
        Task DeleteAsync(Transacao transacao, CancellationToken token);
        Task<Transacao?> GetByIdAsync(Guid id, CancellationToken token);
        Task<IReadOnlyList<Transacao>> GetAllAsync(CancellationToken token);
    }
}
