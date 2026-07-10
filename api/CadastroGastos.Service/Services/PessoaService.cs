using CadastroGastos.Domain.Entities;
using CadastroGastos.Domain.Interfaces;

namespace CadastroGastos.Service.Services;

public class PessoaService : IPessoaService
{
    private readonly IPessoaRepository _pessoaRepository;

    public PessoaService(IPessoaRepository pessoaRepository)
    {
        _pessoaRepository = pessoaRepository;
    }

    public async Task<IEnumerable<Pessoa>> ObterTodasAsync()
    {
        return await _pessoaRepository.GetAllAsync();
    }

    public async Task<Pessoa?> ObterPorIdAsync(int id)
    {
        return await _pessoaRepository.GetByIdAsync(id);
    }

    public async Task<Pessoa> CriarAsync(Pessoa pessoa)
    {
        // Aqui poderia haver validações específicas de pessoa
        return await _pessoaRepository.AddAsync(pessoa);
    }

    public async Task ExcluirAsync(int id)
    {
        var pessoa = await _pessoaRepository.GetByIdAsync(id);
        if (pessoa == null)
            throw new ArgumentException("Pessoa não encontrada.");

        await _pessoaRepository.DeleteAsync(pessoa);
    }
}
