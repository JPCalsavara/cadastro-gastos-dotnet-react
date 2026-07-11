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
        if (transacao.PagadorId == transacao.RecebedorId)
            throw new InvalidOperationException("Uma pessoa não pode enviar uma transação para si mesma.");

        var pagador = await _pessoaRepository.GetByIdAsync(transacao.PagadorId);
        var recebedor = await _pessoaRepository.GetByIdAsync(transacao.RecebedorId);

        if (pagador == null || recebedor == null)
            throw new ArgumentException("Pagador ou Recebedor não encontrado.");

        if (transacao.Tipo.ToLower() == "receita" && (pagador.Idade < 18 || recebedor.Idade < 18))
        {
            throw new InvalidOperationException("Pessoas menores de 18 anos só podem estar envolvidas em transações de despesas.");
        }

        var receitasPagador = await _transacaoRepository.GetTotalReceitasByPessoaAsync(pagador.Id);
        var despesasPagador = await _transacaoRepository.GetTotalDespesasByPessoaAsync(pagador.Id);
        var saldoAtualPagador = pagador.Saldo + receitasPagador - despesasPagador;

        if (saldoAtualPagador - transacao.Valor < 0)
        {
            throw new InvalidOperationException("Saldo insuficiente. A transação deixaria o saldo do pagador negativo.");
        }

        return await _transacaoRepository.AddAsync(transacao);
    }
}
