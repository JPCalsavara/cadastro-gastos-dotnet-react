import type { Transacao } from "../../types";

interface TransacaoCardProps {
  transacao: Transacao;
}

export default function TransacaoCard({ transacao }: TransacaoCardProps) {
  const isDespesa = transacao.tipo === 'despesa';
  const valorClass = isDespesa ? 'text-danger' : 'text-success';

  return (
    <div className="card">
      <div className="card-details">
        <p><strong>Descrição:</strong> {transacao.descricao}</p>
        <p>
          <strong>Valor:</strong>{' '}
          <span className={`card-valor ${valorClass}`}>
            R$ {transacao.valor.toFixed(2)}
          </span>
        </p>
        <p className="text-capitalize"><strong>Tipo:</strong> {transacao.tipo}</p>
        <p className="card-footer-text">
          <strong>De:</strong> {transacao.pagadorNome} (ID: {transacao.pagadorId}) | <strong>Para:</strong> {transacao.recebedorNome} (ID: {transacao.recebedorId})
        </p>
      </div>
    </div>
  );
}
