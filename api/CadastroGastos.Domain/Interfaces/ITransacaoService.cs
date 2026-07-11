using CadastroGastos.Domain.Entities;

namespace CadastroGastos.Domain.Interfaces;

public interface ITransacaoService
{
    Task<IEnumerable<Transacao>> ObterTodasAsync();
    Task<Transacao> CriarAsync(Transacao transacao);
}
