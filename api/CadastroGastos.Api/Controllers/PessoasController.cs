using CadastroGastos.Domain.Entities;
using CadastroGastos.Domain.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace CadastroGastos.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PessoasController : ControllerBase
{
    private readonly IPessoaService _pessoaService;

    public PessoasController(IPessoaService pessoaService)
    {
        _pessoaService = pessoaService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Pessoa>>> GetPessoas()
    {
        var pessoas = await _pessoaService.ObterTodasAsync();
        return Ok(pessoas);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Pessoa>> GetPessoa(int id)
    {
        var pessoa = await _pessoaService.ObterPorIdAsync(id);

        if (pessoa == null)
            return NotFound();

        return Ok(pessoa);
    }

    [HttpPost]
    public async Task<ActionResult<Pessoa>> PostPessoa(Pessoa pessoa)
    {
        var criada = await _pessoaService.CriarAsync(pessoa);
        return CreatedAtAction(nameof(GetPessoa), new { id = criada.Id }, criada);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeletePessoa(int id)
    {
        try
        {
            await _pessoaService.ExcluirAsync(id);
            return NoContent();
        }
        catch (ArgumentException)
        {
            return NotFound();
        }
    }
}
