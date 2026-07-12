# Cadastro de Gastos Residenciais 💰

Um sistema completo full-stack para gestão de despesas e receitas, desenvolvido como desafio técnico. Este projeto foi concebido utilizando a stack moderna de **.NET 8** no back-end e **React (Vite + TypeScript)** no front-end, tudo completamente orquestrado via **Docker Compose**.

## 🚀 Tecnologias

### Back-end
- **C# / .NET 8 (Web API)**
- **Entity Framework Core (Code-First)**
- **PostgreSQL** (Banco de dados relacional)
- **xUnit & Moq** (Testes Unitários)
- **WebApplicationFactory** (Testes de Integração In-Memory)
- **Swagger/OpenAPI** (Documentação da API)
- **Arquitetura em Camadas (Clean Architecture):** Api, Domain, Service, Infrastructure, Tests.

### Front-end
- **React 18** (Vite)
- **TypeScript**
- **React Hook Form & Zod** (Para controle e validação de formulários)
- **Lucide React** (Ícones modernos)
- **Cypress** (Testes End-to-End - E2E)
- **Vitest & React Testing Library** (Testes Unitários de Componentes UI)
- CSS Puro focado em layout responsivo flexível (Grid/Flexbox).

## 💡 Funcionalidades

- **Cadastro de Pessoas**: Permite criar e excluir pessoas (exclusão de pessoa apaga suas transações em cascata). 
- **Cadastro de Transações**: Lançamento de despesas e receitas atreladas a uma pessoa.
- **Regras de Negócio Blindadas**:
  - Pessoas menores de 18 anos **só podem cadastrar despesas**.
  - O sistema impede a criação de despesas se a pessoa não tiver saldo suficiente, prevenindo balanço negativo.
- **Painéis (Dashboard)**: Exibição reativa do total de receitas, despesas e o saldo global (líquido) do sistema, bem como a totalização e saldo por pessoa (Card de Resumo).
- **Tratamento Global de Exceções**: O back-end mapeia violações de domínio (ArgumentException, InvalidOperationException) diretamente para retornos HTTP consistentes (400 Bad Request, 404 NotFound) interceptando o pipeline via Middlewares customizados.

## ⚙️ Como rodar o projeto

Você pode subir toda a infraestrutura da aplicação com um único comando, pois o projeto está dockerizado!

### Pré-requisitos
- Ter o [Docker](https://www.docker.com/) e o Docker Compose instalados na sua máquina.

### Passo a Passo (Ambiente Dockerizado)

1. Clone o repositório na sua máquina local.
2. Na raiz do projeto, execute o comando:

```bash
docker compose up --build
```

3. Aguarde até que o banco de dados Postgres e as imagens do backend e frontend terminem o build e a inicialização.
4. Acesse o sistema pelo navegador:
   - **Frontend (Web App):** [http://localhost](http://localhost)
   - **Backend API (Swagger):** [http://localhost:5000/swagger](http://localhost:5000/swagger)

---

## 🧪 Como executar os Testes

O projeto contém três pilares de testes assegurando 100% de confiabilidade na pipeline.

### 1. Testes do Backend (Unitários e Integração)
Na pasta raiz do projeto, abra um terminal e rode:
```bash
cd api
dotnet test
```

### 2. Testes do Frontend (Unitários - Vitest)
Para testar a estabilidade dos componentes React isolados:
```bash
cd frontend
npm install
npm run test:unit
```

### 3. Testes End-to-End (Fluxo Completo - Cypress)
Com a aplicação **rodando no Docker** (`docker compose up`), abra um terminal na pasta do frontend:
```bash
cd frontend
npm install
npm run test:e2e
```
*(Ele irá realizar interações reais num navegador headless validando o banco de dados e a interface no container)*.

---
Desenvolvido por João Pedro Calsavara para o Desafio Técnico (Maxiprod).