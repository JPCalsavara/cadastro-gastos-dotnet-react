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
        if (string.IsNullOrWhiteSpace(pessoa.Nome) || pessoa.Nome.Length < 3)
            throw new ArgumentException("O nome da pessoa deve ter pelo menos 3 caracteres.");

        if (pessoa.Idade <= 0)
            throw new ArgumentException("A idade deve ser maior que zero.");

        if (await _pessoaRepository.ExisteNomeAsync(pessoa.Nome))
            throw new InvalidOperationException($"Já existe uma pessoa cadastrada com o nome '{pessoa.Nome}'.");

        return await _pessoaRepository.AddAsync(pessoa);
    }

    public async Task ExcluirAsync(int id)
    {
        var pessoa = await _pessoaRepository.GetByIdAsync(id);
        if (pessoa == null)
            throw new KeyNotFoundException("Pessoa não encontrada.");

        await _pessoaRepository.DeleteAsync(pessoa);
    }
}
