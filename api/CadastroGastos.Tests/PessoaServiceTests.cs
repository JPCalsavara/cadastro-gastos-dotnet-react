using CadastroGastos.Domain.Entities;
using CadastroGastos.Domain.Interfaces;
using CadastroGastos.Service.Services;
using Moq;

namespace CadastroGastos.Tests;

public class PessoaServiceTests
{
    [Fact]
    public async Task CriarAsync_NomeMenorQueTresCaracteres_DeveLancarExcecao()
    {
        // Arrange
        var mockPessoaRepo = new Mock<IPessoaRepository>();
        var service = new PessoaService(mockPessoaRepo.Object);
        
        var pessoa = new Pessoa { Nome = "Jo", Idade = 25 };

        // Act & Assert
        await Assert.ThrowsAsync<ArgumentException>(() => service.CriarAsync(pessoa));
    }

    [Fact]
    public async Task CriarAsync_NomeJaExistente_DeveLancarExcecao()
    {
        // Arrange
        var mockPessoaRepo = new Mock<IPessoaRepository>();
        
        // Simula que o repositório diz que já existe
        mockPessoaRepo.Setup(r => r.ExisteNomeAsync("João Silva")).ReturnsAsync(true);

        var service = new PessoaService(mockPessoaRepo.Object);
        var pessoa = new Pessoa { Nome = "João Silva", Idade = 25 };

        // Act & Assert
        await Assert.ThrowsAsync<InvalidOperationException>(() => service.CriarAsync(pessoa));
    }

    [Fact]
    public async Task CriarAsync_DadosValidos_DeveChamarRepositorio()
    {
        // Arrange
        var mockPessoaRepo = new Mock<IPessoaRepository>();
        
        mockPessoaRepo.Setup(r => r.ExisteNomeAsync("Maria Souza")).ReturnsAsync(false);
        var pessoaEsperada = new Pessoa { Id = 1, Nome = "Maria Souza", Idade = 25 };
        mockPessoaRepo.Setup(r => r.AddAsync(It.IsAny<Pessoa>())).ReturnsAsync(pessoaEsperada);

        var service = new PessoaService(mockPessoaRepo.Object);
        var pessoa = new Pessoa { Nome = "Maria Souza", Idade = 25 };

        // Act
        var resultado = await service.CriarAsync(pessoa);

        // Assert
        Assert.NotNull(resultado);
        Assert.Equal(1, resultado.Id);
        mockPessoaRepo.Verify(r => r.AddAsync(pessoa), Times.Once);
    }
}
