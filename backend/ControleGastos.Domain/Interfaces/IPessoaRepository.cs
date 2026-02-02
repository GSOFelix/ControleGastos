using ControleGastos.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ControleGastos.Domain.Interfaces
{
    public interface IPessoaRepository
    {
        Task CreateAsync(Pessoa pessoa, CancellationToken token);
        Task UpdateAsync(Pessoa pessoa, CancellationToken token);
        Task DeleteAsync(Pessoa pessoa, CancellationToken token);
        Task<Pessoa?> GetByIdAsync(Guid id, CancellationToken token);
        Task<IReadOnlyList<Pessoa>> GetAllAsync(CancellationToken token);
    }
}
