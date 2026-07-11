import type { Pessoa, Transacao } from "../../types";

interface PessoaCardProps {
  pessoa: Pessoa;
  transacoes: Transacao[];
  onDelete: (id: number) => void;
}

export default function PessoaCard({ pessoa, transacoes, onDelete }: PessoaCardProps) {
  
  const totalReceitas = transacoes
    .filter(t => t.pessoaId === pessoa.id && t.tipo === 'receita')
    .reduce((acc, curr) => acc + curr.valor, 0);

  const totalDespesas = transacoes
    .filter(t => t.pessoaId === pessoa.id && t.tipo === 'despesa')
    .reduce((acc, curr) => acc + curr.valor, 0);

  const saldoAtual = pessoa.saldo + totalReceitas - totalDespesas;
  
  const saldoClass = saldoAtual >= 0 ? 'text-success' : 'text-danger';

  return (
    <div className="card">
      <div className="card-details">
        <p><strong>Nome:</strong> {pessoa.nome}</p>
        <p><strong>Idade:</strong> {pessoa.idade} anos</p>
        
        <div className="card-totals">
          <p className="text-success"><strong>Receitas:</strong> R$ {totalReceitas.toFixed(2)}</p>
          <p className="text-danger"><strong>Despesas:</strong> R$ {totalDespesas.toFixed(2)}</p>
        </div>

        <p className="card-saldo">
          <strong>Saldo:</strong> 
          <span className={`card-saldo-value ${saldoClass}`}>
            R$ {saldoAtual.toFixed(2)}
          </span>
        </p>
      </div>
      <button onClick={() => onDelete(pessoa.id)} className="btn-delete">Excluir</button>
    </div>
  );
}
