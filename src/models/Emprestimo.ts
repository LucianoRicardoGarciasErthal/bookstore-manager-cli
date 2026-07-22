// ✅ CORRIGIDO: status agora usa 'ativo' e 'finalizado' para alinhar com o schema SQL
export type StatusEmprestimo = "ativo" | "finalizado";

// ✅ CORRIGIDO: livro_id → id_livro, cliente_id → id_cliente
export interface Emprestimo {
  id: number;
  id_livro: number;           // era 'livro_id'
  id_cliente: number;         // era 'cliente_id'
  data_emprestimo: Date;
  data_devolucao_prevista?: string;
  data_devolucao?: Date | null;
  status: StatusEmprestimo;
}

// ✅ CORRIGIDO: livro_id → id_livro, cliente_id → id_cliente
export interface EmprestimoInput {
  id_livro: number;           // era 'livro_id'
  id_cliente: number;         // era 'cliente_id'
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
  id_livro: number;           // era 'livro_id'
  id_cliente: number;         // era 'cliente_id'
  data_emprestimo: Date;
  data_devolucao_prevista?: string;
  data_devolucao?: Date | null;
  status: StatusEmprestimo;

  constructor(dados: Emprestimo) {
    this.id = dados.id;
    this.id_livro = dados.id_livro;           // era 'livro_id'
    this.id_cliente = dados.id_cliente;       // era 'cliente_id'
    this.data_emprestimo = dados.data_emprestimo;
    this.data_devolucao_prevista = dados.data_devolucao_prevista;
    this.data_devolucao = dados.data_devolucao;
    this.status = dados.status;
  }
}