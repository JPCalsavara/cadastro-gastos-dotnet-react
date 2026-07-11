import BalancoGeral from './BalancoGeral';
import type { Transacao } from '../../types';

interface DashboardPageProps {
  transacoes: Transacao[];
}

export default function DashboardPage({ transacoes }: DashboardPageProps) {
  return (
    <div className="page-container">
      <h2 className="dashboard-title">Dashboard de Totais</h2>
      
      {/* RF07: Balanço Geral */}
      <BalancoGeral transacoes={transacoes} />
    </div>
  );
}
