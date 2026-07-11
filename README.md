# Controle de Gastos Residenciais

Este é um sistema web full-stack desenvolvido para facilitar o controle financeiro de uma residência. O foco do projeto foi criar uma arquitetura robusta e escalável, separando claramente as responsabilidades entre o frontend em React e o backend em .NET 8.

## Como a aplicação foi construída

A solução inteira roda em containers Docker, o que significa que o banco de dados PostgreSQL, a API e o cliente React sobem com um único comando. Isso elimina dores de cabeça com configuração de ambiente local.

No frontend, decidi elevar o estado principal para o componente raiz. Isso permite que a tela de Pessoas e a de Transações compartilhem a mesma fonte de verdade, recalculando saldos e totais instantaneamente sem precisar sobrecarregar a rede com dezenas de requisições.

Para garantir que ninguém consiga burlar o sistema via ferramentas externas ou injetando requisições maliciosas, adotei uma dupla camada de validação. O React barra erros na interface para dar um feedback rápido ao usuário, mas é o backend quem atua como o verdadeiro guardião das regras de negócio.

## Estrutura e Clean Architecture

O backend em .NET segue os princípios de Clean Architecture. Dividi o código em camadas bem definidas para manter tudo testável e organizado:

```text
cadastro-dotnet-react/
├── api/
│   ├── CadastroGastos.Api/             # Exposição dos endpoints REST
│   ├── CadastroGastos.Domain/          # Entidades e interfaces centrais
│   ├── CadastroGastos.Infrastructure/  # Comunicação com o PostgreSQL via EF Core
│   ├── CadastroGastos.Service/         # Lógica pura de negócios e validações
│   └── CadastroGastos.Tests/           # Testes automatizados (xUnit + Moq)
├── frontend/                           # Interface em React + Vite + TypeScript
└── docker-compose.yml                  # Orquestração do ambiente
```

## Como o domínio foi modelado

O coração do sistema gira em torno de dois conceitos: Pessoas e Transações.

Uma **Pessoa** possui seu identificador, nome e idade. No ecossistema financeiro, ela atua tanto como quem paga quanto como quem recebe o dinheiro.

A **Transação** representa o movimento do dinheiro. Ela registra de onde o valor saiu e para quem ele foi, a quantia exata e se caracteriza uma despesa ou receita. Essa abordagem garante rastreabilidade total do fluxo de caixa.

## Regras de Negócio e Segurança

Para manter a consistência financeira da aplicação, implementei verificações estritas no nível de serviço:

- **Proteção contra Saldo Negativo:** O sistema não permite registrar uma despesa que deixe o pagador no vermelho. A consistência matemática da conta é mantida a todo custo.
- **Prevenção de Ciclos:** Uma transação é bloqueada caso o pagador e o recebedor sejam a mesma pessoa.
- **Regra de Menoridade:** Usuários com menos de 18 anos têm restrições. Eles só podem realizar despesas, sendo estritamente bloqueados de participar de receitas.
- **Integridade de Vínculos:** Graças ao Entity Framework, é impossível registrar uma transação apontando para um usuário fantasma. Além disso, se uma pessoa for deletada, todo o seu histórico financeiro é apagado em cascata para não poluir o banco.

## Explorando a API

Você pode explorar e testar todos os endpoints de forma interativa acessando a interface do Swagger em `http://localhost:5000/swagger/index.html` após iniciar a aplicação.

### Pessoas
- `GET /api/pessoas` Lista todo mundo que está cadastrado.
- `GET /api/pessoas/{id}` Traz os detalhes de um usuário específico.
- `POST /api/pessoas` Insere um novo usuário no sistema.
- `DELETE /api/pessoas/{id}` Exclui o cadastro e limpa todas as transações ligadas a ele automaticamente.

### Transações
- `GET /api/transacoes` Lista o histórico completo de movimentações.
- `POST /api/transacoes` Tenta registrar uma transação, passando primeiro por todo o motor de regras de negócio antes de salvar.

## Como testar na sua máquina

Você não precisa instalar SDKs pesados ou configurar bancos de dados na mão. Tendo o Docker instalado, basta seguir estes passos rápidos:

1. Clone este repositório.
2. Acesse a pasta do projeto pelo terminal e rode o comando:
   ```bash
   docker compose up -d --build
   ```
3. Abra o seu navegador e acesse a interface gráfica em `http://localhost`.

O banco de dados subirá silenciosamente na porta 5432 e as tabelas serão criadas de forma automática pelas migrations do Entity Framework assim que a API iniciar.

## Requisitos do Desafio Atendidos

Todos os requisitos propostos na especificação técnica original foram contemplados com sucesso:

- Backend construído integralmente em .NET 8.
- Frontend responsivo desenvolvido com React, TypeScript e Vite.
- Dados persistidos de forma relacional no PostgreSQL.
- Código validado por testes unitários focados na lógica de negócios e amplamente documentado.