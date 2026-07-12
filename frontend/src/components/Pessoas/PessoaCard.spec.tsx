import { render, screen } from '@testing-library/react';
import PessoaCard from './PessoaCard';
import type { Pessoa, Transacao } from '../../types';

describe('PessoaCard Component', () => {
  const mockPessoa: Pessoa = {
    id: 1,
    nome: 'João Silva',
    idade: 30,
    saldo: 0
  };

  const mockTransacoes: Transacao[] = [
    {
      id: 1,
      pessoaId: 1,
      descricao: 'Salário',
      valor: 5000,
      tipo: 'receita'
    },
    {
      id: 2,
      pessoaId: 1,
      descricao: 'Aluguel',
      valor: 1500,
      tipo: 'despesa'
    }
  ];

  it('deve renderizar o nome e a idade da pessoa', () => {
    render(<PessoaCard pessoa={mockPessoa} transacoes={[]} onDelete={() => {}} />);
    
    expect(screen.getByText('João Silva')).toBeInTheDocument();
    expect(screen.getByText('30 anos')).toBeInTheDocument();
  });

  it('deve calcular corretamente as receitas, despesas e saldo atual', () => {
    render(<PessoaCard pessoa={mockPessoa} transacoes={mockTransacoes} onDelete={() => {}} />);
    
    // Total Receitas: 5000
    // Total Despesas: 1500
    // Saldo Atual: 0 + 5000 - 1500 = 3500
    expect(screen.getByText('R$ 5000.00')).toBeInTheDocument(); // Receita
    expect(screen.getByText('R$ 1500.00')).toBeInTheDocument(); // Despesa
    expect(screen.getByText('R$ 3500.00')).toBeInTheDocument(); // Saldo
  });
});
