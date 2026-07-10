import type { Transacao } from "../../types";

interface BalancoGeralProps {
  transacoes: Transacao[];
}

export default function BalancoGeral({ transacoes }: BalancoGeralProps) {
  
  const totalReceitas = transacoes
    .filter(t => t.tipo === 'receita')
    .reduce((acc, curr) => acc + curr.valor, 0);

  const totalDespesas = transacoes
    .filter(t => t.tipo === 'despesa')
    .reduce((acc, curr) => acc + curr.valor, 0);

  const saldoGlobal = totalReceitas - totalDespesas;

  return (
    <div className="card-geral">
      <h3>Balanço Global</h3>
      
      <div className="card-geral-details">
        <div className="card-geral-item">
          <span>Total de Receitas</span>
          <strong className="text-success">R$ {totalReceitas.toFixed(2)}</strong>
        </div>
        
        <div className="card-geral-item">
          <span>Total de Despesas</span>
          <strong className="text-danger">R$ {totalDespesas.toFixed(2)}</strong>
        </div>

        <div className="card-geral-item highlight-saldo">
          <span>Saldo Líquido</span>
          <strong className={saldoGlobal >= 0 ? 'text-success' : 'text-danger'}>
            R$ {saldoGlobal.toFixed(2)}
          </strong>
        </div>
      </div>
    </div>
  );
}
