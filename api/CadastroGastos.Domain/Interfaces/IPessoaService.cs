using CadastroGastos.Domain.Entities;

namespace CadastroGastos.Domain.Interfaces;

public interface IPessoaService
{
    Task<IEnumerable<Pessoa>> ObterTodasAsync();
    Task<Pessoa?> ObterPorIdAsync(int id);
    Task<Pessoa> CriarAsync(Pessoa pessoa);
    Task ExcluirAsync(int id);
}
