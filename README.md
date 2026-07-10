# Desafio Técnico: Controle de Gastos Residenciais

## 🎯 Objetivo
Implementar um sistema web de controle de gastos residenciais, com gestão de cadastros de transações e pessoas, e consulta de totais, contendo documentação clara e comentários explicativos sobre a lógica adotada.

---

## ⚙️ Tecnologias e Requisitos Não Funcionais (RNF)

- **RNF01 (Backend):** `.NET` com `C#`.
- **RNF02 (Frontend):** `React` com `TypeScript`.
- **RNF03 (Persistência):** Os dados devem persistir e não podem ser perdidos após fechar a aplicação (banco de dados/arquivos).
- **RNF04 (Documentação):** A lógica de desenvolvimento deve ser clara e documentada no próprio código-fonte por meio de comentários.

---

## 📌 Requisitos Funcionais (RF)

### 1. Módulo de Pessoas
- **RF01 - Gerenciamento:** O sistema deve permitir a criação, listagem e deleção de pessoas.
- **RF02 - Dados de Cadastro:** O cadastro de pessoa deve exigir:
  - Identificador (único e gerado automaticamente)
  - Nome
  - Idade
- **RF03 - Exclusão em Cascata:** Em casos em que se delete uma pessoa, todas as transações associadas a ela deverão ser apagadas automaticamente.

### 2. Módulo de Transações
- **RF04 - Gerenciamento:** O sistema deve permitir a criação e listagem de transações (edição e deleção não são necessárias).
- **RF05 - Dados de Cadastro:** O cadastro de transação deverá conter:
  - Identificador (único e gerado automaticamente)
  - Descrição
  - Valor
  - Tipo (Despesa ou Receita)
  - Pessoa (Identificador da pessoa vinculada)

### 3. Consulta de Totais
- **RF06 - Balanço por Pessoa:** O sistema deve listar todas as pessoas cadastradas, exibindo o total de receitas, despesas e o saldo individual (receita – despesa) de cada uma.
- **RF07 - Balanço Geral:** Ao final da listagem, deve ser exibido o totalizador geral de todas as pessoas, incluindo o total global de receitas, o total de despesas e o saldo líquido.

---

## 🛑 Regras de Negócio (RN)

- **RN01 - Vínculo Obrigatório:** O valor informado no campo "Pessoa" (identificador) precisa obrigatoriamente existir no cadastro de pessoas.
- **RN02 - Restrição de Menoridade:** Caso a pessoa informada na transação seja menor de idade (menor de 18 anos), o sistema deve permitir **apenas** o cadastro de transações do tipo "Despesa".

---

## 📋 Informações Adicionais do Desafio

### Critérios de Avaliação
A avaliação deste teste técnico será baseada nos seguintes pontos:
1. Aderência às regras de negócio.
2. Atenção aos detalhes.
3. Qualidade e legibilidade do código.
4. Boas práticas de programação.

### Orientações de Entrega e Restrições
- **Formato:** Subir o código-fonte final da solução em um repositório Git público.
- **Confidencialidade:** Qualquer referência à empresa (Maxiprod) deve ser removida de todos os arquivos antes da publicação.
- **Extras:** Fica a critério do candidato implementar recursos adicionais (UI/UX, novas funcionalidades, etc.), **desde que os mesmos não afetem o funcionamento dos requisitos já especificados** neste documento.
- **Dúvidas:** rh@maxiprod.com.br (Título: "Dúvida teste técnico Desenvolvimento").