export type StatusEmprestimo = "ATIVO" | "DEVOLVIDO";

export interface Emprestimo {
  id: number;
  livro_id: number;
  cliente_id: number;
  data_emprestimo: Date;
  data_devolucao_prevista?: string;
  data_devolucao?: Date | null;
  status: StatusEmprestimo;
}

export interface EmprestimoInput {
  livro_id: number;
  cliente_id: number;
  data_devolucao_prevista?: string;
}

/**
 * Resultado de consultas de empréstimos com JOIN,
 * trazendo o título do livro e o nome do cliente.
 */
export interface EmprestimoDetalhado extends Emprestimo {
  livro_titulo: string;
  cliente_nome: string;
}

export class EmprestimoModel implements Emprestimo {
  id: number;
  livro_id: number;
  cliente_id: number;
  data_emprestimo: Date;
  data_devolucao_prevista?: string;
  data_devolucao?: Date | null;
  status: StatusEmprestimo;

  constructor(dados: Emprestimo) {
    this.id = dados.id;
    this.livro_id = dados.livro_id;
    this.cliente_id = dados.cliente_id;
    this.data_emprestimo = dados.data_emprestimo;
    this.data_devolucao_prevista = dados.data_devolucao_prevista;
    this.data_devolucao = dados.data_devolucao;
    this.status = dados.status;
  }
}
