using ControleGastos.Application.Dtos;
using ControleGastos.Application.Queries;
using ControleGastos.Domain.Enums;
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
    /// Repositório responsável apenas por consultas de relatórios e resumos de saldo.
    /// 
    /// Diferente dos repositórios de CRUD, essa classe foca somente em READ (queries),
    /// retornando dados já agregados/prontos para exibição.
    /// 
    /// Aqui eu utilizo consultas projetadas (Select + DTO) para evitar carregar
    /// entidades completas desnecessariamente e melhorar a performance.
    /// 
    /// Nenhuma regra de negócio deve ser implementada aqui,
    /// apenas cálculos de agregação e leitura de dados.
    /// </summary>
    public class SaldoQueryRepository : ISaldoQuery
    {
        private readonly AppDbContext _context;

        public SaldoQueryRepository(AppDbContext context)
        {
            _context = context;
        }


        /// <summary>
        /// Retorna um resumo financeiro agrupado por categoria.
        /// 
        /// Para cada categoria são calculados:
        /// - total de receitas
        /// - total de despesas
        /// - saldo (receita - despesa)
        /// 
        /// Utilizo AsNoTracking para melhorar performance,
        /// pois é uma consulta somente leitura.
        /// 
        /// O retorno já vem mapeado diretamente para DTO,
        /// evitando expor entidades do domínio.
        /// </summary>
        public async Task<TransacoesTotaisCategoriaDto.RelatorioCategoriaResponse> ObterResumoSaldoCategoriaAsync(CancellationToken token)
        {
            var categorias = await _context.Categorias
                .AsNoTracking()
                .Select(c => new TransacoesTotaisCategoriaDto.RelatorioCategoriaItem(
                    c.Id,
                    c.Descricao,
                    c.Transacoes
                        .Where(t => t.Tipo == ETipoTransacao.Receita)
                        .Sum(t => (decimal?)t.Valor) ?? 0,
                    c.Transacoes
                        .Where(t => t.Tipo == ETipoTransacao.Despesa)
                        .Sum(t => (decimal?)t.Valor) ?? 0,
                    c.Transacoes.Sum(t =>
                        t.Tipo == ETipoTransacao.Receita ? t.Valor : -t.Valor)
                ))
                .ToListAsync(token);

            var totalReceita = categorias.Sum(x => x.TotalReceita);
            var totalDespesa = categorias.Sum(x => x.TotalDespesa);

            return new TransacoesTotaisCategoriaDto.RelatorioCategoriaResponse(
                categorias,
                totalReceita,
                totalDespesa,
                totalReceita - totalDespesa);
        }


        /// <summary>
        /// Retorna um resumo financeiro agrupado por pessoa.
        /// 
        /// Segue a mesma lógica do relatório por categoria,
        /// porém agrupando as transações por responsável.
        /// 
        /// Também utiliza projeção direta para DTO e AsNoTracking
        /// para manter a consulta mais leve e eficiente.
        /// </summary>
        public async Task<TransacoesTotaisPessoaDto.RelatorioPessoaResponse> ObterResumoSaldoPessoaAsync(CancellationToken token)
        {
            var pessoas = await _context.Pessoas
                .AsNoTracking()
                .Select(p => new TransacoesTotaisPessoaDto.RelatorioPessoaItem(
                    p.Id,
                    p.Nome,
                    p.Transacoes
                        .Where(t => t.Tipo == ETipoTransacao.Receita)
                        .Sum(t => (decimal?)t.Valor) ?? 0,
                    p.Transacoes
                        .Where(t => t.Tipo == ETipoTransacao.Despesa)
                        .Sum(t => (decimal?)t.Valor) ?? 0,
                    p.Transacoes.Sum(t =>
                        t.Tipo == ETipoTransacao.Receita ? t.Valor : -t.Valor)
                ))
                .ToListAsync(token);

            var totalReceitas = pessoas.Sum(x => x.TotalReceita);
            var totalDespesas = pessoas.Sum(x => x.TotalDespesa);

            return new TransacoesTotaisPessoaDto.RelatorioPessoaResponse(
                pessoas,
                totalReceitas,
                totalDespesas,
                totalReceitas - totalDespesas
            );
        }
    }

}
