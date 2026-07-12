describe('Cadastro de Gastos E2E', () => {
  it('deve adicionar uma nova pessoa com sucesso e exibi-la na tela', () => {
    // Acessa a raiz (baseUrl configurada)
    cy.visit('/');
    cy.wait(1000);
    
    // Clica no botão Adicionar Pessoa
    cy.get('button').contains('Adicionar Pessoa').should('be.visible').click({ force: true });
    
    // Preenche o modal
    cy.get('input[placeholder="Ex: João Silva"]').should('be.visible').type('Pessoa Teste Cypress');
    cy.get('input[placeholder="Ex: 25"]').type('25');
    
    // Salvar
    cy.get('button[type="submit"]').contains('Salvar Pessoa').click();
    
    // Verifica se a nova pessoa aparece no grid
    cy.contains('Pessoa Teste Cypress').should('be.visible');
    cy.contains('25 anos').should('be.visible');
  });
});
