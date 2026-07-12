# Cadastro de Gastos Residenciais

Sistema web para controle de receitas e despesas residenciais desenvolvido como solução para desafio técnico. 

A aplicação permite cadastrar pessoas e registrar transações financeiras (receitas e despesas) associadas a elas, incluindo regras de negócio como controle de idade para receitas e validação de saldo para evitar contas negativas.

## Arquitetura e Tecnologias

O projeto é dividido em um back-end construído em .NET e um front-end em React, orquestrados via Docker Compose.

### Back-end (API REST)
Desenvolvido em **.NET 8** utilizando princípios de Clean Architecture, isolando regras de negócio em camadas de domínio e serviço. 
- **Entity Framework Core**: Acesso a dados (Code-First) com cascata configurada.
- **PostgreSQL**: Banco de dados relacional.
- **Exception Handling**: Middleware global para mapeamento de exceções de domínio em respostas HTTP (400, 404, etc).
- **xUnit + Moq**: Testes unitários das lógicas e serviços.
- **WebApplicationFactory**: Testes de integração em banco em memória validando os endpoints.

### Front-end
Desenvolvido em **React 18** (via **Vite**) e **TypeScript**.
- **React Hook Form + Zod**: Gerenciamento de estado e validação de formulários.
- **Vitest + React Testing Library**: Testes unitários validando cálculos de interface e renderização.
- **Cypress**: Testes End-to-End validando o fluxo principal da aplicação.
- Estilização em CSS puro usando propriedades responsivas (Flexbox e Grid).

## Como Executar

A infraestrutura completa roda em containers via Docker.

```bash
# Na raiz do projeto, execute:
docker compose up --build
```

Após a inicialização dos containers, o acesso se dá pelas URLs:
- **Web App (React)**: [http://localhost](http://localhost)
- **Documentação da API (Swagger)**: [http://localhost:5000/swagger](http://localhost:5000/swagger)

## Suíte de Testes

Para garantir a qualidade, o código contém cobertura de testes unitários, integração e E2E.

**Testes de Back-end (Unitários e Integração)**
```bash
cd api/CadastroGastos.Tests
dotnet test
```

**Testes Unitários de Front-end (Vitest)**
```bash
cd frontend
npm install
npm run test:unit
```

**Testes E2E (Cypress)**
Certifique-se de que a aplicação está rodando na porta 80 via Docker (`docker compose up`) antes de executar:
```bash
cd frontend
npm install
npm run test:e2e
```
