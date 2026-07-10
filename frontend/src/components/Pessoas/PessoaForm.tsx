import React, { useState } from 'react';
import { criarPessoa } from '../../services/api';
import type { Pessoa } from '../../types';

interface PessoaFormProps {
  onAdd: (novaPessoa: Pessoa) => void;
}

export default function PessoaForm({ onAdd }: PessoaFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [nome, setNome] = useState('');
  const [idade, setIdade] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      const novaPessoa = await criarPessoa({
        nome,
        idade: parseInt(idade),
        saldo: 0
      });

      onAdd(novaPessoa);
      setNome('');
      setIdade('');
      setIsOpen(false);
    } catch (error) {
      alert(error);
    }
  };

  return (
    <>
      <div className="form-header">
        <h2>Pessoas</h2>
        {!isOpen && (
          <button onClick={() => setIsOpen(true)} className="btn-toggle">+ Adicionar Pessoa</button>
        )}
      </div>

      {isOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="dynamic-form-header">
              <h3>Nova Pessoa</h3>
              <button type="button" className="btn-close" onClick={() => setIsOpen(false)}>X</button>
            </div>
            
            <form onSubmit={handleSubmit} className="dynamic-form-body">
              <div className="form-group">
                <label>Nome:</label>
                <input 
                  type="text" 
                  value={nome} 
                  onChange={(e) => setNome(e.target.value)} 
                  required 
                  placeholder="Ex: João Silva"
                />
              </div>
              <div className="form-group">
                <label>Idade:</label>
                <input 
                  type="number" 
                  value={idade} 
                  onChange={(e) => setIdade(e.target.value)} 
                  required 
                  placeholder="Ex: 25"
                />
              </div>
              <button type="submit" className="btn-submit">Salvar Pessoa</button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
