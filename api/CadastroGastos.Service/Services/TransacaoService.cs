using CadastroGastos.Domain.Entities;
using CadastroGastos.Domain.Interfaces;

namespace CadastroGastos.Service.Services;

public class TransacaoService : ITransacaoService
{
    private readonly ITransacaoRepository _transacaoRepository;
    private readonly IPessoaRepository _pessoaRepository;

    public TransacaoService(ITransacaoRepository transacaoRepository, IPessoaRepository pessoaRepository)
    {
        _transacaoRepository = transacaoRepository;
        _pessoaRepository = pessoaRepository;
    }

    public async Task<IEnumerable<Transacao>> ObterTodasAsync()
    {
        return await _transacaoRepository.GetAllAsync();
    }

    public async Task<Transacao> CriarAsync(Transacao transacao)
    {
        var pessoa = await _pessoaRepository.GetByIdAsync(transacao.PessoaId);

        if (pessoa == null)
            throw new ArgumentException("Pessoa não encontrada.");

        if (transacao.Valor <= 0)
            throw new ArgumentException("O valor da transação deve ser positivo.");

        var tipoLower = transacao.Tipo?.ToLower() ?? "";
        if (tipoLower != "receita" && tipoLower != "despesa")
            throw new ArgumentException("O tipo da transação deve ser 'receita' ou 'despesa'.");

        if (tipoLower == "receita" && pessoa.Idade < 18)
        {
            throw new InvalidOperationException("Pessoas menores de 18 anos só podem estar envolvidas em transações de despesas.");
        }

        var receitas = await _transacaoRepository.GetTotalReceitasByPessoaAsync(pessoa.Id);
        var despesas = await _transacaoRepository.GetTotalDespesasByPessoaAsync(pessoa.Id);
        var saldoAtual = pessoa.Saldo + receitas - despesas;

        if (transacao.Tipo.ToLower() == "despesa" && saldoAtual - transacao.Valor < 0)
        {
            throw new InvalidOperationException("Saldo insuficiente. A transação deixaria o saldo negativo.");
        }

        return await _transacaoRepository.AddAsync(transacao);
    }
}
