import BalancoGeral from './BalancoGeral';
import type { Transacao } from '../../types';

interface DashboardPageProps {
  transacoes: Transacao[];
}

export default function DashboardPage({ transacoes }: DashboardPageProps) {
  return (
    <div className="page-container">
      {/* RF07: Balanço Geral */}
      <BalancoGeral transacoes={transacoes} />
    </div>
  );
}
