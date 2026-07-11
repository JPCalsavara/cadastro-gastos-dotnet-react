import React from 'react';
import TransacaoForm from './TransacaoForm';
import TransacaoList from './TransacaoList';
import type { Transacao, Pessoa } from '../../types';

interface TransacoesPageProps {
  pessoas: Pessoa[];
  transacoes: Transacao[];
  setTransacoes: React.Dispatch<React.SetStateAction<Transacao[]>>;
  onRefetch: () => Promise<void>;
}

export default function TransacoesPage({ pessoas, transacoes, setTransacoes, onRefetch }: TransacoesPageProps) {

  const handleAdd = (novaTransacao: Transacao) => {
    setTransacoes(transacoes => [...transacoes, novaTransacao]);
  };

  return (
    <div className="page-container">
      <TransacaoForm onAdd={handleAdd} pessoas={pessoas} transacoes={transacoes} onRefetch={onRefetch} />
      <TransacaoList transacoes={transacoes} />
    </div>
  );
}
