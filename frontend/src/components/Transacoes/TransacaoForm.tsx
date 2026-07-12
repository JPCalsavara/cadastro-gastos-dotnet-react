import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { criarTransacao } from '../../services/api';
import type { Transacao, Pessoa } from '../../types';

const transacaoSchema = z.object({
  descricao: z.string().min(3, 'Descrição deve ter pelo menos 3 caracteres'),
  valor: z.string().refine(val => parseFloat(val) > 0, 'Valor deve ser positivo'),
  tipo: z.union([z.literal('receita'), z.literal('despesa')]),
  pessoaId: z.string().refine(val => parseInt(val) > 0, 'Selecione uma pessoa')
});

type TransacaoFormInputs = z.infer<typeof transacaoSchema>;

interface TransacaoFormProps {
  onAdd: (novaTransacao: Transacao) => void;
  pessoas: Pessoa[];
  transacoes: Transacao[];
  onRefetch: () => Promise<void>;
}

export default function TransacaoForm({ onAdd, pessoas, onRefetch }: TransacaoFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<TransacaoFormInputs>({
    resolver: zodResolver(transacaoSchema)
  });

  const onSubmit = async (data: TransacaoFormInputs) => {
    const pessoa = pessoas.find(p => p.id === parseInt(data.pessoaId));

    // Regra de Negócio: Menores de 18 anos só podem cadastrar despesas
    if (data.tipo === 'receita' && pessoa && pessoa.idade < 18) {
      alert('Erro: Pessoas menores de 18 anos só podem estar envolvidas em transações de despesas.');
      return;
    }
    
    try {
      const transacaoCriada = await criarTransacao({
        descricao: data.descricao,
        valor: parseFloat(data.valor),
        tipo: data.tipo,
        pessoaId: parseInt(data.pessoaId)
      });

      onAdd(transacaoCriada);
      reset();
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
            
            <form onSubmit={handleSubmit(onSubmit)} className="dynamic-form-body">
              <div className="form-group">
                <label>Descrição:</label>
                <input 
                  type="text" 
                  {...register('descricao')}
                  placeholder="Ex: Aluguel, Supermercado..."
                />
                {errors.descricao && <span className="error-msg">{errors.descricao.message}</span>}
              </div>
              
              <div className="form-group">
                <label>Valor (R$):</label>
                <input 
                  type="number" 
                  step="0.01"
                  {...register('valor')}
                  placeholder="Ex: 1500.50"
                />
                {errors.valor && <span className="error-msg">{errors.valor.message}</span>}
              </div>
              
              <div className="form-group">
                <label>Tipo:</label>
                <select {...register('tipo')}>
                  <option value="">Selecione o tipo...</option>
                  <option value="receita">Receita</option>
                  <option value="despesa">Despesa</option>
                </select>
                {errors.tipo && <span className="error-msg">{errors.tipo.message}</span>}
              </div>
              <div className="form-group">
                <label>Pessoa:</label>
                <select {...register('pessoaId')}>
                  <option value={0}>Selecione a pessoa...</option>
                  {pessoas && pessoas.map(p => (
                    <option key={p.id} value={p.id}>{p.nome}</option>
                  ))}
                </select>
                {errors.pessoaId && <span className="error-msg">{errors.pessoaId.message}</span>}
              </div>
              
              <button type="submit" className="btn-submit">Salvar Transação</button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
