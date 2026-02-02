using ControleGastos.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ControleGastos.Domain.Interfaces
{
    public interface ICategoriaRepository
    {
        Task CreateAsync(Categoria categoria,CancellationToken token);
        Task UpdateAsync(Categoria categoria, CancellationToken token);
        Task DeleteAsync(Categoria categoria, CancellationToken token);
        Task<Categoria?> GetByIdAsync(Guid id, CancellationToken token);
        Task<IReadOnlyList<Categoria>> GetAllAsync(CancellationToken token);
    }
}
