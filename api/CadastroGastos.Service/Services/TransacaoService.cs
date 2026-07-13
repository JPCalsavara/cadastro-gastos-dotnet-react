using CadastroGastos.Domain.Entities;
using CadastroGastos.Domain.Interfaces;
using CadastroGastos.Domain.DTOs;

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

    public async Task<Transacao> CriarAsync(TransacaoCreateDto transacaoDto)
    {
        var pessoa = await _pessoaRepository.GetByIdAsync(transacaoDto.PessoaId);

        if (pessoa == null)
            throw new ArgumentException("Pessoa não encontrada.");

        if (transacaoDto.Valor <= 0)
            throw new ArgumentException("O valor da transação deve ser positivo.");

        if (transacaoDto.Tipo == CadastroGastos.Domain.Enums.TipoTransacao.Receita && pessoa.Idade < 18)
        {
            throw new InvalidOperationException("Pessoas menores de 18 anos só podem estar envolvidas em transações de despesas.");
        }



        var transacao = new Transacao
        {
            Descricao = transacaoDto.Descricao,
            Valor = transacaoDto.Valor,
            Tipo = transacaoDto.Tipo,
            PessoaId = transacaoDto.PessoaId
        };

        return await _transacaoRepository.AddAsync(transacao);
    }
}
