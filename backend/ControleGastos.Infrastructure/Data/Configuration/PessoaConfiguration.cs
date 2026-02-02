using ControleGastos.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ControleGastos.Infrastructure.Data.Configuration
{
    public class PessoaConfiguration : IEntityTypeConfiguration<Pessoa>
    {
        public void Configure(EntityTypeBuilder<Pessoa> builder)
        {
            builder.HasKey(x => x.Id);
            builder.Property(x => x.Nome).IsRequired().HasMaxLength(200);
            builder.Property(x => x.Idade).IsRequired();

            builder.HasMany(t => t.Transacoes)
                .WithOne(p => p.Pessoa)
                .HasForeignKey(t =>t.PessoaId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasIndex(x => x.Nome);

        }
    }
}
