import { useState } from 'react';
import PessoaCard from './PessoaCard';
import type { Pessoa, Transacao } from '../../types';

interface PessoaListProps {
  pessoas: Pessoa[];
  transacoes: Transacao[];
  onDelete: (id: number) => void;
}

export default function PessoaList({ pessoas, transacoes, onDelete }: PessoaListProps) {
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 4;

  // Cálculos de paginação
  const indexUltimoItem = paginaAtual * itensPorPagina;
  const indexPrimeiroItem = indexUltimoItem - itensPorPagina;
  const pessoasExibidas = pessoas.slice(indexPrimeiroItem, indexUltimoItem);
  const totalPaginas = Math.ceil(pessoas.length / itensPorPagina);

  return (
    <div className="list-container">
      <h3>Lista de Pessoas</h3>
      
      {/* Grid de 1 coluna, já que a sessão ocupa 1/3 da tela */}
      <div className="list-grid-1">
        {pessoasExibidas.map(pessoa => (
          <PessoaCard 
            key={pessoa.id} 
            pessoa={pessoa} 
            transacoes={transacoes}
            onDelete={onDelete} 
          />
        ))}
      </div>

      {/* Controles de Paginação usando classes */}
      {totalPaginas > 1 && (
        <div className="pagination-container">
          <button 
            className="btn-pagination"
            onClick={() => setPaginaAtual(prev => Math.max(prev - 1, 1))}
            disabled={paginaAtual === 1}
          >
            Anterior
          </button>
          
          <span>
            Página {paginaAtual} de {totalPaginas}
          </span>
          
          <button 
            className="btn-pagination"
            onClick={() => setPaginaAtual(prev => Math.min(prev + 1, totalPaginas))}
            disabled={paginaAtual === totalPaginas}
          >
            Próxima
          </button>
        </div>
      )}
    </div>
  );
}
