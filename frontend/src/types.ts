export interface Pessoa{
  id: number;
  nome: string;
  idade: number;
  saldo: number;
}

export interface Transacao{
  id: number;
  recebedorId: number;
  recebedorNome?: string;
  pagadorId: number;
  pagadorNome?: string;
  descricao: string;
  valor: number;
  tipo: TipoTransacao;
}

export type TipoTransacao = 'despesa' | 'receita';