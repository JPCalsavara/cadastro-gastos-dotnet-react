import { useState } from 'react';
import TransacaoCard from './TransacaoCard';
import type { Transacao } from '../../types';

interface TransacaoListProps {
  transacoes: Transacao[];
}

export default function TransacaoList({ transacoes }: TransacaoListProps) {
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 6; // 3 colunas x 2 linhas = 6 itens

  const indexUltimoItem = paginaAtual * itensPorPagina;
  const indexPrimeiroItem = indexUltimoItem - itensPorPagina;
  // Agora usamos a lista do estado 'transacoes'
  const transacoesExibidas = transacoes.slice(indexPrimeiroItem, indexUltimoItem);
  const totalPaginas = Math.ceil(transacoes.length / itensPorPagina);

  return (
    <div className="list-container">
      <h3>Lista de Transações</h3>
      
      {/* Grid de 2 colunas, pois ocupa 2/3 da tela */}
      <div className="list-grid-2">
        {transacoesExibidas.map(transacao => (
          <TransacaoCard key={transacao.id} transacao={transacao} />
        ))}
      </div>

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
