using CadastroGastos.Domain.Entities;
using CadastroGastos.Domain.Interfaces;
using CadastroGastos.Service.Services;
using Moq;

namespace CadastroGastos.Tests;

public class TransacaoServiceTests
{
    [Fact]
    public async Task CriarAsync_MenorDeIdadeCriandoReceita_DeveLancarExcecao()
    {
        // Arrange
        var mockTransacaoRepo = new Mock<ITransacaoRepository>();
        var mockPessoaRepo = new Mock<IPessoaRepository>();
        
        var pessoa = new Pessoa { Id = 1, Idade = 15, Saldo = 0 }; // Menor de idade

        mockPessoaRepo.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(pessoa);

        var service = new TransacaoService(mockTransacaoRepo.Object, mockPessoaRepo.Object);
        
        var transacao = new Transacao 
        { 
            PessoaId = 1, 
            Valor = 100, 
            Tipo = "receita" 
        };

        // Act & Assert
        await Assert.ThrowsAsync<InvalidOperationException>(() => service.CriarAsync(transacao));
    }

    [Fact]
    public async Task CriarAsync_SaldoInsuficiente_DeveLancarExcecao()
    {
        // Arrange
        var mockTransacaoRepo = new Mock<ITransacaoRepository>();
        var mockPessoaRepo = new Mock<IPessoaRepository>();
        
        var pessoa = new Pessoa { Id = 1, Idade = 25, Saldo = 100 };

        mockPessoaRepo.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(pessoa);
        
        // Simula que ele já gastou 50, então saldo atual é 100 + 0 - 50 = 50
        mockTransacaoRepo.Setup(r => r.GetTotalReceitasByPessoaAsync(1)).ReturnsAsync(0);
        mockTransacaoRepo.Setup(r => r.GetTotalDespesasByPessoaAsync(1)).ReturnsAsync(50);

        var service = new TransacaoService(mockTransacaoRepo.Object, mockPessoaRepo.Object);
        
        var transacao = new Transacao 
        { 
            PessoaId = 1, 
            Valor = 100, // Ele só tem 50 de saldo livre, 100 deixaria negativo
            Tipo = "despesa" 
        };

        // Act & Assert
        await Assert.ThrowsAsync<InvalidOperationException>(() => service.CriarAsync(transacao));
    }

    [Fact]
    public async Task CriarAsync_DadosValidos_DeveRetornarTransacaoCriada()
    {
        // Arrange
        var mockTransacaoRepo = new Mock<ITransacaoRepository>();
        var mockPessoaRepo = new Mock<IPessoaRepository>();
        
        var pessoa = new Pessoa { Id = 1, Idade = 25, Saldo = 500 };

        mockPessoaRepo.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(pessoa);
        
        // Simula histórico limpo
        mockTransacaoRepo.Setup(r => r.GetTotalReceitasByPessoaAsync(1)).ReturnsAsync(0);
        mockTransacaoRepo.Setup(r => r.GetTotalDespesasByPessoaAsync(1)).ReturnsAsync(0);

        var transacao = new Transacao 
        { 
            Id = 99,
            PessoaId = 1, 
            Valor = 100, 
            Tipo = "despesa" 
        };

        mockTransacaoRepo.Setup(r => r.AddAsync(It.IsAny<Transacao>())).ReturnsAsync(transacao);

        var service = new TransacaoService(mockTransacaoRepo.Object, mockPessoaRepo.Object);

        // Act
        var resultado = await service.CriarAsync(transacao);

        // Assert
        Assert.NotNull(resultado);
        Assert.Equal(99, resultado.Id);
        mockTransacaoRepo.Verify(r => r.AddAsync(transacao), Times.Once);
    }
}
