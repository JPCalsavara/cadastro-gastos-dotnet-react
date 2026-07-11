import PessoaForm from './PessoaForm';
import PessoaList from './PessoaList';
import { deletarPessoa } from '../../services/api';
import type { Pessoa, Transacao } from '../../types';
import React from 'react';

interface PessoasPageProps {
  pessoas: Pessoa[];
  setPessoas: React.Dispatch<React.SetStateAction<Pessoa[]>>;
  transacoes: Transacao[];
  onRefetch: () => Promise<void>;
}

export default function PessoasPage({ pessoas, setPessoas, transacoes, onRefetch }: PessoasPageProps) {

  const handleAdd = (novaPessoa: Pessoa) => {
    setPessoas(pessoasAtuais => [...pessoasAtuais, novaPessoa]);  
  };

  // Exclusão de pessoa com refetch reativo (sem window.location.reload)
  const handleDelete = async (id: number) => {
    try {
      await deletarPessoa(id);
      // Recarrega os dados do servidor (pessoas + transações em cascata)
      await onRefetch();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="page-container">
      <PessoaForm onAdd={handleAdd} />
      <PessoaList pessoas={pessoas} transacoes={transacoes} onDelete={handleDelete} />
    </div>
  );
}
