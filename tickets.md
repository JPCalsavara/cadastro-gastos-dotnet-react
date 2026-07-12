# Wayfinder Map: Migração de Relacionamento Transação-Pessoa (1:N)

## Destination

Alterar a modelagem de `Transacao` (que atualmente possui Pagador e Recebedor) para pertencer a apenas uma `Pessoa` (Pessoa 1 : N Transações), removendo a complexidade de envio/recebimento entre dois usuários, impactando o banco de dados, regras de negócio no backend e formulários/listagens no frontend.

## Notes

- Domínio: Gestão de Gastos Residenciais.
- O tracker utilizado é este arquivo Markdown local (`tickets.md`).
- A mudança deve ser feita em fatias completas para não quebrar o build.
- Cada ticket deve ser implementado usando `/implement`.

## Decisions so far

- [Ticket 1] Atualizar Entidades de Domínio e Banco de Dados (Backend) — Criado o relacionamento 1:N entre Pessoa e Transacao e gerada a migration.
- [Ticket 2] Atualizar Regras de Negócio e Testes (Backend) — Adaptado o TransacaoService, Repositório e Testes para a nova modelagem de um único PessoaId.
- [Ticket 3] Atualizar Tipos e Interface de Usuário (Frontend) — Ajustado types.ts, api.ts e a exibição/envio de formulários no React para apenas 1 pessoa vinculada.
- [Ticket 4] Refatorar Validações de Formulário no Frontend (Zod) — Adicionado Zod e react-hook-form; criados schemas com z.string().refine e mensagens de erro na UI.
- [Ticket 5] Adicionar Validações de Duplicidade e Integridade (Backend) — Criado PessoaServiceTests usando TDD, e adicionado ExisteNomeAsync no PessoaRepository para impedir duplicidade de Nomes.
- [Ticket 6] Setup Testes Unitários no Frontend (Jest/Vitest + RTL) — Adicionado Vitest e JSDOM, configurado no Vite e escrito teste de renderização e cálculo do PessoaCard.
- [Ticket 8] Setup Testes End-to-End (E2E) no Frontend (Cypress) — Instalado Cypress, configurado baseUrl com acesso ao server local via port 80 e criado fluxo ponta-a-ponta testando a inclusão de uma nova Pessoa.

## Tickets (Frontier & Blocked)

*(Todos os tickets da transição 1:N foram concluídos com sucesso!)*

## Not yet specified

- O escopo de Cypress assume que teremos uma base de dados previsível ou mockada para o E2E, o que pode exigir uma configuração extra (*fog* leve que o ticket resolverá). O caminho até os testes rodarem está bem fatiado.

## Out of scope

- Refatoração de design ou estilização não relacionada aos campos alterados.
