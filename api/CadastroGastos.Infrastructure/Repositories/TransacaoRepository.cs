using CadastroGastos.Domain.Entities;
using CadastroGastos.Domain.Interfaces;
using CadastroGastos.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CadastroGastos.Infrastructure.Repositories;

public class TransacaoRepository : ITransacaoRepository
{
    private readonly AppDbContext _context;

    public TransacaoRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Transacao>> GetAllAsync()
    {
        return await _context.Transacoes
            .Include(t => t.Pessoa)
            .ToListAsync();
    }

    public async Task<Transacao> AddAsync(Transacao transacao)
    {
        _context.Transacoes.Add(transacao);
        await _context.SaveChangesAsync();
        return transacao;
    }

    public async Task<decimal> GetTotalReceitasByPessoaAsync(int pessoaId)
    {
        return await _context.Transacoes
            .Where(t => t.PessoaId == pessoaId && t.Tipo == "receita")
            .SumAsync(t => t.Valor);
    }

    public async Task<decimal> GetTotalDespesasByPessoaAsync(int pessoaId)
    {
        return await _context.Transacoes
            .Where(t => t.PessoaId == pessoaId && t.Tipo == "despesa")
            .SumAsync(t => t.Valor);
    }
}
