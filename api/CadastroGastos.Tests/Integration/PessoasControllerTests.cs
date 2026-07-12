using System.Net;
using System.Net.Http.Json;
using CadastroGastos.Domain.Entities;
using Microsoft.AspNetCore.Mvc.Testing;

namespace CadastroGastos.IntegrationTests;

public class PessoasControllerTests : IClassFixture<CustomWebApplicationFactory<Program>>
{
    private readonly HttpClient _client;

    public PessoasControllerTests(CustomWebApplicationFactory<Program> factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task CriarPessoa_DeveRetornarCriadoEBuscarComSucesso()
    {
        // 1. Arrange: Create person payload
        var novaPessoa = new
        {
            Nome = "Teste Integracao",
            Idade = 30,
            Saldo = 0
        };

        // 2. Act: Post to /api/pessoas
        var response = await _client.PostAsJsonAsync("/api/pessoas", novaPessoa);

        // 3. Assert: Must return 201 Created
        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
        
        var pessoaCriada = await response.Content.ReadFromJsonAsync<Pessoa>();
        Assert.NotNull(pessoaCriada);
        Assert.Equal("Teste Integracao", pessoaCriada.Nome);
        Assert.Equal(30, pessoaCriada.Idade);
        Assert.True(pessoaCriada.Id > 0);

        // 4. Act: Get /api/pessoas/{id}
        var getResponse = await _client.GetAsync($"/api/pessoas/{pessoaCriada.Id}");
        
        // 5. Assert: Must return 200 OK and match data
        getResponse.EnsureSuccessStatusCode();
        var pessoaBuscada = await getResponse.Content.ReadFromJsonAsync<Pessoa>();
        
        Assert.NotNull(pessoaBuscada);
        Assert.Equal(pessoaCriada.Id, pessoaBuscada.Id);
    }
}
