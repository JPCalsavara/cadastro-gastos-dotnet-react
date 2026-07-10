using CadastroGastos.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace CadastroGastos.Infrastructure.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Pessoa> Pessoas { get; set; } = null!;
    public DbSet<Transacao> Transacoes { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configuração do Delete em Cascata
        // Se uma pessoa for deletada, as transações onde ela é Pagadora serão deletadas
        modelBuilder.Entity<Transacao>()
            .HasOne(t => t.Pagador)
            .WithMany(p => p.TransacoesPagas)
            .HasForeignKey(t => t.PagadorId)
            .OnDelete(DeleteBehavior.Cascade);

        // Se uma pessoa for deletada, as transações onde ela é Recebedora serão deletadas
        modelBuilder.Entity<Transacao>()
            .HasOne(t => t.Recebedor)
            .WithMany(p => p.TransacoesRecebidas)
            .HasForeignKey(t => t.RecebedorId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
