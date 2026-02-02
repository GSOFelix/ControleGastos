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
    public class TransacaoConfiguration : IEntityTypeConfiguration<Transacao>
    {
        public void Configure(EntityTypeBuilder<Transacao> builder)
        {
            builder.HasKey(x => x.Id);

            builder.Property(x => x.Descricao)
            .IsRequired()
            .HasMaxLength(400);


            builder.Property(x => x.Valor)
                .IsRequired()
                .HasPrecision(18, 2);

            builder.Property(x => x.Tipo)
                .IsRequired()
                .HasConversion<int>();

            builder.Property(x => x.Data)
                .IsRequired()
                .HasColumnType("timestamp with time zone");

            builder.HasOne(t => t.Pessoa)
                .WithMany(p => p.Transacoes)
                .HasForeignKey(t => t.PessoaId)
                .OnDelete(DeleteBehavior.Cascade);


            builder.HasOne(t => t.Categoria)
                .WithMany(c => c.Transacoes)
                .HasForeignKey(t => t.CategoriaId)
                .OnDelete(DeleteBehavior.Restrict);

           
            builder.HasIndex(x => x.PessoaId);
            builder.HasIndex(x => x.CategoriaId);

        }
    }
}
