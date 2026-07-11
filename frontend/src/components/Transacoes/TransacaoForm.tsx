import React, { useState } from 'react';
import { criarTransacao } from '../../services/api';
import type { Transacao, Pessoa } from '../../types';

interface TransacaoFormProps {
  onAdd: (novaTransacao: Transacao) => void;
  pessoas: Pessoa[];
  transacoes: Transacao[];
  onRefetch: () => Promise<void>;
}

export default function TransacaoForm({ onAdd, pessoas, transacoes, onRefetch }: TransacaoFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [tipo, setTipo] = useState('');
  const [pagadorId, setPagadorId] = useState('');
  const [recebedorId, setRecebedorId] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Regra de Negócio: A pessoa não pode enviar transações para ela mesma
    if (pagadorId === recebedorId) {
      alert('Erro: Uma pessoa não pode enviar uma transação para si mesma.');
      return;
    }

    const pagador = pessoas.find(p => p.id === parseInt(pagadorId));
    const recebedor = pessoas.find(p => p.id === parseInt(recebedorId));
    const valorNum = parseFloat(valor);

    // Regra de Negócio: Menores de 18 anos só podem cadastrar despesas
    if (tipo === 'receita') {
      if ((pagador && pagador.idade < 18) || (recebedor && recebedor.idade < 18)) {
        alert('Erro: Pessoas menores de 18 anos só podem estar envolvidas em transações de despesas.');
        return;
      }
    }

    // Regra de Negócio: O pagador não pode ficar com saldo negativo
    const calculaSaldo = (id: number) => {
      const pessoa = pessoas.find(p => p.id === id);
      const saldoInicial = pessoa ? pessoa.saldo : 0;
      
      const receitas = transacoes
        .filter(t => t.recebedorId === id)
        .reduce((acc, curr) => acc + curr.valor, 0);
      const despesas = transacoes
        .filter(t => t.pagadorId === id)
        .reduce((acc, curr) => acc + curr.valor, 0);
      
      return saldoInicial + receitas - despesas;
    };

    const saldoPagador = calculaSaldo(parseInt(pagadorId));
    
    if (saldoPagador - valorNum < 0) {
      alert('Erro: Saldo insuficiente. A transação deixaria o saldo do pagador negativo.');
      return;
    }
    
    try {
      const transacaoCriada = await criarTransacao({
        descricao,
        valor: valorNum,
        tipo,
        pagadorId: parseInt(pagadorId),
        recebedorId: parseInt(recebedorId)
      });

      onAdd(transacaoCriada);
      setDescricao('');
      setValor('');
      setTipo('');
      setPagadorId('');
      setRecebedorId('');
      setIsOpen(false);
      // Recarrega dados do servidor para sincronizar saldos
      await onRefetch();
    } catch (error: any) {
      alert(`Erro no servidor: ${error.message}`);
    }
  };

  return (
    <>
      <div className="form-header">
        <h2>Transações</h2>
        {!isOpen && (
          <button onClick={() => setIsOpen(true)} className="btn-toggle">+ Adicionar Transação</button>
        )}
      </div>

      {isOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="dynamic-form-header">
              <h3>Nova Transação</h3>
              <button type="button" className="btn-close" onClick={() => setIsOpen(false)}>X</button>
            </div>
            
            <form onSubmit={handleSubmit} className="dynamic-form-body">
              <div className="form-group">
                <label>Descrição:</label>
                <input 
                  type="text" 
                  value={descricao} 
                  onChange={(e) => setDescricao(e.target.value)} 
                  required 
                  placeholder="Ex: Aluguel, Supermercado..."
                />
              </div>
              
              <div className="form-group">
                <label>Valor (R$):</label>
                <input 
                  type="number" 
                  step="0.01"
                  value={valor} 
                  onChange={(e) => setValor(e.target.value)} 
                  required 
                  placeholder="Ex: 1500.50"
                />
              </div>
              
              <div className="form-group">
                <label>Tipo:</label>
                <select value={tipo} onChange={(e) => setTipo(e.target.value)} required>
                  <option value="">Selecione o tipo...</option>
                  <option value="receita">Receita</option>
                  <option value="despesa">Despesa</option>
                </select>
              </div>
              <div className="form-group">
                <label>Pagador:</label>
                <select value={pagadorId} onChange={(e) => setPagadorId(e.target.value)} required>
                  <option value="">Selecione a pessoa...</option>
                  {pessoas && pessoas.map(p => (
                    <option key={p.id} value={p.id}>{p.nome}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label>Recebedor:</label>
                <select value={recebedorId} onChange={(e) => setRecebedorId(e.target.value)} required>
                  <option value="">Selecione a pessoa...</option>
                  {pessoas && pessoas.map(p => (
                    <option key={p.id} value={p.id}>{p.nome}</option>
                  ))} 
                </select>
              </div>
              
              <button type="submit" className="btn-submit">Salvar Transação</button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
