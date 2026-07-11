export interface Pessoa{
  id: number;
  nome: string;
  idade: number;
  saldo: number;
}

export interface Transacao{
  id: number;
  pessoaId: number;
  pessoa?: Pessoa;
  descricao: string;
  valor: number;
  tipo: TipoTransacao;
}

export type TipoTransacao = 'despesa' | 'receita';