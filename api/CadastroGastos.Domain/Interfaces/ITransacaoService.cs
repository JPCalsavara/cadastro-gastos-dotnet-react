using CadastroGastos.Domain.Entities;
using CadastroGastos.Domain.DTOs;

namespace CadastroGastos.Domain.Interfaces;

public interface ITransacaoService
{
    Task<IEnumerable<Transacao>> ObterTodasAsync();
    Task<Transacao> CriarAsync(TransacaoCreateDto transacaoDto);
}
