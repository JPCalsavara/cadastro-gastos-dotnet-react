describe('Cadastro de Gastos E2E', () => {
  beforeEach(() => {
    // Limpa o estado da base antes do teste para evitar paginação ocultando os dados
    cy.request('GET', 'http://localhost:5000/api/pessoas').then(response => {
      if (Array.isArray(response.body)) {
        response.body.forEach((pessoa: any) => {
          cy.request('DELETE', `http://localhost:5000/api/pessoas/${pessoa.id}`);
        });
      }
    });
  });

  it('deve adicionar uma nova pessoa, transacoes e conferir paineis', () => {
    cy.visit('/');
    
    // Gerar nome único apenas com letras para evitar erro no regex do Zod
    const letters = 'abcdefghijklmnopqrstuvwxyz';
    const randomLetters = Array.from({length: 6}, () => letters[Math.floor(Math.random() * letters.length)]).join('');
    const nomeUnico = `Pessoa Teste ${randomLetters}`;

    cy.intercept('POST', '/api/pessoas').as('postPessoa');

    // 1. Criar Pessoa
    cy.get('button').contains('Adicionar Pessoa').should('be.visible').click({ force: true });
    cy.get('input[placeholder="Ex: João Silva"]').should('be.visible').type(nomeUnico);
    cy.get('input[placeholder="Ex: 25"]').type('25');
    cy.get('button[type="submit"]').contains('Salvar Pessoa').click();
    
    cy.wait('@postPessoa').then(interception => {
        expect(interception.response?.statusCode).to.eq(201);
    });

    // Verifica se a nova pessoa aparece no grid
    cy.contains(nomeUnico).should('be.visible');
    cy.contains('25 anos').should('be.visible');

    cy.intercept('POST', '/api/transacoes').as('postTransacao');

    // 2. Adicionar Receita
    cy.get('button').contains('Adicionar Transação').should('be.visible').click({ force: true });
    cy.get('input[placeholder="Ex: Aluguel, Supermercado..."]').should('be.visible').type('Salário');
    cy.get('input[placeholder="Ex: 1500.50"]').type('1000');
    cy.contains('label', 'Tipo:').next('select').select('receita');
    cy.contains('label', 'Pessoa:').next('select').select(nomeUnico);
    cy.get('button[type="submit"]').contains('Salvar Transação').click();
    
    cy.wait('@postTransacao').then(interception => {
        if (interception.response?.statusCode !== 201) {
            throw new Error('ERRO DO BACKEND (RECEITA): ' + JSON.stringify(interception.response?.body));
        }
        expect(interception.response?.statusCode).to.eq(201);
    });

    // 3. Adicionar Despesa
    cy.get('button').contains('Adicionar Transação').should('be.visible').click({ force: true });
    cy.get('input[placeholder="Ex: Aluguel, Supermercado..."]').should('be.visible').type('Conta de Luz');
    cy.get('input[placeholder="Ex: 1500.50"]').type('200');
    cy.contains('label', 'Tipo:').next('select').select('despesa');
    cy.contains('label', 'Pessoa:').next('select').select(nomeUnico);
    cy.get('button[type="submit"]').contains('Salvar Transação').click();

    cy.wait('@postTransacao').then(interception => {
        if (interception.response?.statusCode !== 201) {
            throw new Error('ERRO DO BACKEND (DESPESA): ' + JSON.stringify(interception.response?.body));
        }
        expect(interception.response?.statusCode).to.eq(201);
    });

    // Aguardar re-render dos dados
    cy.wait(500);

    // 4. Validar Totais no Card da Pessoa (Receitas: 1000, Despesas: 200, Saldo: 800)
    // O texto no card é R$ 1000.00, R$ 200.00, etc. Vamos checar visibilidade.
    cy.contains('R$ 1000.00').should('be.visible');
    cy.contains('R$ 200.00').should('be.visible');
    cy.contains('R$ 800.00').should('be.visible');
    
    // 5. Validar Dashboard Global
    // Assegurar que o dashboard de totais reflita as métricas certas.
    // Como os valores podem bater, validar dentro do bloco do dashboard.
    cy.get('.dashboard-footer').within(() => {
      cy.contains('R$ 1000.00').should('be.visible');
      cy.contains('R$ 200.00').should('be.visible');
      cy.contains('R$ 800.00').should('be.visible');
    });
  });
});
