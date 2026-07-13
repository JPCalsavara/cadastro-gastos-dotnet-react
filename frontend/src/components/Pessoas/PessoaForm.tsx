import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { criarPessoa } from '../../services/api';
import type { Pessoa } from '../../types';

const pessoaSchema = z.object({
  nome: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres').regex(/^[a-zA-ZÀ-ÿ\s]+$/, 'Nome deve conter apenas letras e espaços'),
  idade: z.string().refine(val => 100 > parseInt(val) &&  parseInt(val) > 0, 'Idade deve ser maior que 0 e menor que 100')
});

type PessoaFormInputs = z.infer<typeof pessoaSchema>;

interface PessoaFormProps {
  onAdd: (novaPessoa: Pessoa) => void;
}

export default function PessoaForm({ onAdd }: PessoaFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<PessoaFormInputs>({
    resolver: zodResolver(pessoaSchema)
  });

  const onSubmit = async (data: PessoaFormInputs) => {
    setApiError(null);
    try {
      const novaPessoa = await criarPessoa({
        nome: data.nome,
        idade: parseInt(data.idade),
        saldo: 0
      });

      onAdd(novaPessoa);
      reset();
      setIsOpen(false);
    } catch (error: any) {
      setApiError(error.message || 'Erro ao comunicar com o servidor');
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
              <button type="button" className="btn-close" onClick={() => {
                setIsOpen(false);
                setApiError(null);
              }}>X</button>
            </div>
            
            {apiError && (
              <button className="error-banner" onClick={() => setApiError(null)}>
                ⚠️ {apiError} (Clique para fechar)
              </button>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="dynamic-form-body">
              <div className="form-group">
                <label>Nome:</label>
                <input 
                  type="text" 
                  {...register('nome')}
                  placeholder="Ex: João Silva"
                />
                {errors.nome && <span className="error-msg">{errors.nome.message}</span>}
              </div>
              <div className="form-group">
                <label>Idade:</label>
                <input 
                  type="number" 
                  {...register('idade')}
                  placeholder="Ex: 25"
                />
                {errors.idade && <span className="error-msg">{errors.idade.message}</span>}
              </div>
              <button type="submit" className="btn-submit">Salvar Pessoa</button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
