using CadastroGastos.Domain.Interfaces;
using CadastroGastos.Infrastructure.Data;
using CadastroGastos.Infrastructure.Repositories;
using CadastroGastos.Service.Services;
using Microsoft.EntityFrameworkCore;

namespace CadastroGastos.Api.Configurations;

public static class DependencyInjectionConfig
{
    public static IServiceCollection AddInfrastructureServices(this IServiceCollection services, IConfiguration configuration)
    {
        // Database configuration
        services.AddDbContext<AppDbContext>(options =>
            options.UseNpgsql(configuration.GetConnectionString("DefaultConnection")));

        // Repositories
        services.AddScoped<IPessoaRepository, PessoaRepository>();
        services.AddScoped<ITransacaoRepository, TransacaoRepository>();

        return services;
    }

    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        // Services
        services.AddScoped<IPessoaService, PessoaService>();
        services.AddScoped<ITransacaoService, TransacaoService>();

        return services;
    }

    public static IServiceCollection AddCorsConfiguration(this IServiceCollection services, IConfiguration configuration)
    {
        var allowedOrigins = configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? Array.Empty<string>();

        services.AddCors(options =>
        {
            options.AddPolicy("AllowReactApp",
                policy => policy.WithOrigins(allowedOrigins)
                                .AllowAnyMethod()
                                .AllowAnyHeader());
        });

        return services;
    }
}
