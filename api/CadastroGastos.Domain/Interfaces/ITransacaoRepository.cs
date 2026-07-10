using CadastroGastos.Domain.Entities;

namespace CadastroGastos.Domain.Interfaces;

public interface ITransacaoRepository
{
    Task<IEnumerable<Transacao>> GetAllAsync();
    Task<Transacao> AddAsync(Transacao transacao);
    Task<decimal> GetTotalReceitasByPessoaAsync(int pessoaId);
    Task<decimal> GetTotalDespesasByPessoaAsync(int pessoaId);
}
