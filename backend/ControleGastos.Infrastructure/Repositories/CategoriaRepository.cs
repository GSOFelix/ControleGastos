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
    /// Implementação do repositório de Categoria utilizando EF Core.
    /// 
    /// Essa classe é responsável apenas pela persistência dos dados.
    /// Regras de negócio NÃO devem ficar aqui, apenas acesso ao banco.
    /// 
    /// A aplicação depende da interface (ICategoriaRepository)
    /// para manter o domínio desacoplado da infraestrutura.
    /// </summary>
    public class CategoriaRepository : ICategoriaRepository
    {
        private readonly AppDbContext _context;

        public CategoriaRepository(AppDbContext context)
        {
            _context = context;
        }


        /// <summary>
        /// Persiste uma nova categoria no banco.
        /// </summary>
        public async Task CreateAsync(Categoria categoria, CancellationToken token)
        {
            await _context.Categorias.AddAsync(categoria, token);
            await _context.SaveChangesAsync(token);
        }


        /// <summary>
        /// Remove a categoria informada.
        /// A regra de integridade (transações vinculadas) é tratada pelo EF/relacionamento.
        /// </summary>
        public async Task DeleteAsync(Categoria categoria, CancellationToken token)
        {
            _context.Categorias.Remove(categoria);
            await _context.SaveChangesAsync(token);
        }


        /// <summary>
        /// Retorna todas as categorias cadastradas.
        /// Consulta simples sem rastreamento de regras de negócio.
        /// </summary>
        public async Task<IReadOnlyList<Categoria>> GetAllAsync(CancellationToken token)
        {
            return await _context.Categorias.ToListAsync(token);
        }


        /// <summary>
        /// Busca uma categoria pelo identificador.
        /// Retorna null caso não exista.
        /// </summary>
        public async Task<Categoria?> GetByIdAsync(Guid id, CancellationToken token)
        {
            return await _context.Categorias
                .FirstOrDefaultAsync(x => x.Id == id, token);
        }


        /// <summary>
        /// Atualiza os dados da categoria.
        /// O EF controla o tracking das alterações.
        /// </summary>
        public async Task UpdateAsync(Categoria categoria, CancellationToken token)
        {
            _context.Categorias.Update(categoria);
            await _context.SaveChangesAsync(token);
        }
    }
}
