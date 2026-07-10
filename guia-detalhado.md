# Guia Detalhado: Projeto .NET + React

Este guia expande o `guia.md` com explicações focadas em relembrar as convenções do ecosistema .NET (C#) e a integração com React.

---

## 1. Configuração Inicial

Hoje em dia, a forma mais comum e eficiente de trabalhar com React e .NET é criar os projetos separados (uma pasta para o Backend e outra para o Frontend) e conectá-los via chamadas HTTP (API REST), resolvendo problemas de CORS. 

### Criando os Projetos

**Backend (.NET Web API)**
```bash
dotnet new webapi -n CadastroGastos.Api
```

**Frontend (React com TypeScript e Vite)**
```bash
npm create vite@latest CadastroGastos.Client -- --template react-ts
```

*(Opcional)* **Docker Compose**
Crie um arquivo `docker-compose.yml` na raiz do repositório para subir o banco de dados facilmente.
```yaml
version: '3.8'
services:
  db:
    image: postgres:latest # ou mssql/server
    environment:
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: adminpassword
      POSTGRES_DB: cadastrogastos
    ports:
      - "5432:5432"
```

---

## 2. Backend (.NET)

### 2.1 Entity Framework e DbContext (Banco de Dados)

Instale os pacotes do Entity Framework (EF Core) no diretório da API (`CadastroGastos.Api`):
```bash
dotnet add package Microsoft.EntityFrameworkCore.Design
dotnet add package Microsoft.EntityFrameworkCore.Tools
dotnet add package Npgsql.EntityFrameworkCore.PostgreSQL # Se usar Postgres
```

**O que é o DbContext?**
O `DbContext` é a classe central do Entity Framework. Ele atua como uma ponte entre as suas classes em C# e as tabelas no banco de dados. Nele você declara os `DbSet` (que representam as tabelas) e configura regras mais complexas.

```csharp
using Microsoft.EntityFrameworkCore;
using CadastroGastos.Api.Models;

namespace CadastroGastos.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    // Representam as tabelas no banco de dados
    public DbSet<Pessoa> Pessoas { get; set; }
    public DbSet<Transacao> Transacoes { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // RF03: Exclusão em Cascata (Cascade Delete) via Fluent API
        modelBuilder.Entity<Pessoa>()
            .HasMany(p => p.Transacoes)
            .WithOne(t => t.Pessoa)
            .HasForeignKey(t => t.PessoaId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
```

### 2.2 Entidades e Decorators (Attributes)

No C#, "decorators" são chamados de **Attributes**. Eles são usados acima de classes ou propriedades para definir regras de validação (Data Annotations), mapeamento para o banco ou configurações de roteamento na API.

```csharp
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CadastroGastos.Api.Models;

[Table("Pessoas")] // Atributo: Força o nome da tabela no banco
public class Pessoa
{
    [Key] // Atributo: Define como Chave Primária
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)] // Auto-incremento
    public int Id { get; set; }

    [Required(ErrorMessage = "O nome é obrigatório.")] // Validação da API e Banco
    [MaxLength(100)]
    public string Nome { get; set; } = string.Empty;

    [Required]
    public int Idade { get; set; }
    
    // Propriedade de Navegação (Relacionamento 1:N)
    public virtual ICollection<Transacao>? Transacoes { get; set; }
}
```

### 2.3 Configurando Injeção de Dependência e CORS (`Program.cs`)

O arquivo `Program.cs` é a porta de entrada da sua aplicação. É aqui que você registra o DbContext, seus Serviços/Repositórios e, crucialmente, o CORS para o React.

```csharp
var builder = WebApplication.CreateBuilder(args);

// 1. Configurar o DbContext
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// 2. Configurar CORS (Permitir o Frontend React acessar a API)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy => policy.WithOrigins("http://localhost:5173") // Porta padrão do Vite
                        .AllowAnyMethod()
                        .AllowAnyHeader());
});

// 3. Registrar Repositórios e Serviços (Injeção de Dependência)
// builder.Services.AddScoped<IPessoaRepository, PessoaRepository>();
// builder.Services.AddScoped<IPessoaService, PessoaService>();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowReactApp"); // Aplicar política de CORS
app.UseAuthorization();
app.MapControllers();

app.Run();
```

Adicione a connection string no arquivo `appsettings.json`:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Database=cadastrogastos;Username=admin;Password=adminpassword"
  },
  // ...
}
```

### 2.4 Controladores e Endpoints (Controllers)

O Controller é a classe que recebe as requisições HTTP do seu React.

```csharp
using Microsoft.AspNetCore.Mvc;

namespace CadastroGastos.Api.Controllers;

[ApiController] // Habilita validação automática e comportamentos de API Rest
[Route("api/[controller]")] // A rota fica 'api/pessoas' (nome da classe sem 'Controller')
public class PessoasController : ControllerBase
{
    private readonly IPessoaService _pessoaService;

    // Injeção pelo construtor
    public PessoasController(IPessoaService pessoaService)
    {
        _pessoaService = pessoaService;
    }

    [HttpGet] // Responde a requisições GET em api/pessoas
    public async Task<IActionResult> Get()
    {
        var pessoas = await _pessoaService.GetAllAsync();
        return Ok(pessoas);
    }

    [HttpPost] // Responde a requisições POST em api/pessoas
    public async Task<IActionResult> Post([FromBody] Pessoa pessoa)
    {
        // Se a validação dos [Required] falhar, ele nem chega aqui graças ao [ApiController]
        await _pessoaService.AddAsync(pessoa);
        return CreatedAtAction(nameof(Get), new { id = pessoa.Id }, pessoa);
    }
}
```

### 2.5 Gerando o Banco de Dados (Migrations)

Sempre que você criar ou alterar Entidades, você precisa atualizar o banco usando o Migrations.
```bash
dotnet ef migrations add InitialCreate
dotnet ef database update
```

---

## 3. Frontend (React)

No frontend, a integração ocorre unicamente pelo consumo das rotas REST expostas pelo backend.

### 3.1 Cliente HTTP (Axios ou Fetch)

Você usará o Axios (ou Fetch nativo) configurado com a URL do backend.

```typescript
// src/services/api.ts
import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Porta em que a API .NET roda
});
```

### 3.2 Consumindo e Tipando os Dados

Crie serviços separados para as chamadas para manter o código limpo.

```typescript
// src/services/pessoasService.ts
import { api } from './api';

export interface Pessoa {
  id: number;
  nome: string;
  idade: number;
}

export const getPessoas = async (): Promise<Pessoa[]> => {
  const response = await api.get<Pessoa[]>('/pessoas');
  return response.data;
};
```

E no seu componente React:
```tsx
import { useEffect, useState } from 'react';
import { getPessoas, Pessoa } from '../services/pessoasService';

export function ListagemPessoas() {
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);

  useEffect(() => {
    getPessoas().then(dados => setPessoas(dados));
  }, []);

  return (
    <ul>
      {pessoas.map(p => <li key={p.id}>{p.nome} - {p.idade} anos</li>)}
    </ul>
  );
}
```

---

## Conclusão e Próximos Passos
Esta é a fundação. O próximo passo prático é configurar a sua Solution (`.sln`), inicializar os projetos (`dotnet new webapi` e `npm create vite`) e começar a codificar as **Entidades** e o **DbContext** (Módulo de Backend) descritas no `README.md`.
