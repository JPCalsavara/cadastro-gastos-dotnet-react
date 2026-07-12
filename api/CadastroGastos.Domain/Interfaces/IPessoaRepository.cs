using CadastroGastos.Domain.Entities;

namespace CadastroGastos.Domain.Interfaces;

public interface IPessoaRepository
{
    Task<IEnumerable<Pessoa>> GetAllAsync();
    Task<Pessoa?> GetByIdAsync(int id);
    Task<bool> ExisteNomeAsync(string nome);
    Task<Pessoa> AddAsync(Pessoa pessoa);
    Task DeleteAsync(Pessoa pessoa);
}
