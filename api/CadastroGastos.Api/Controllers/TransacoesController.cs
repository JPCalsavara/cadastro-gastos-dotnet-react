using CadastroGastos.Domain.Entities;
using CadastroGastos.Domain.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace CadastroGastos.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TransacoesController : ControllerBase
{
    private readonly ITransacaoService _transacaoService;

    public TransacoesController(ITransacaoService transacaoService)
    {
        _transacaoService = transacaoService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Transacao>>> GetTransacoes()
    {
        var transacoes = await _transacaoService.ObterTodasAsync();
        return Ok(transacoes);
    }

    [HttpPost]
    public async Task<ActionResult<Transacao>> PostTransacao(CadastroGastos.Domain.DTOs.TransacaoCreateDto transacaoDto)
    {
        var criada = await _transacaoService.CriarAsync(transacaoDto);
        return CreatedAtAction(nameof(GetTransacoes), new { id = criada.Id }, criada);
    }
}
