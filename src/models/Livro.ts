export interface Livro {
  id: number;
  titulo: string;
  genero?: string;
  ano_publicacao?: number;
  quantidade_total: number;
  quantidade_disponivel: number;
  id_autor: number;  // <-- CORRIGIDO
  criado_em?: Date;
}

export interface LivroInput {
  titulo: string;
  genero?: string;
  ano_publicacao?: number;
  quantidade_total: number;
  id_autor: number;  // <-- CORRIGIDO
}

/**
 * Representação de um livro já com o nome do autor
 * (resultado de consultas com JOIN).
 */
export interface LivroComAutor extends Livro {
  autor_nome: string;
}

export class LivroModel implements Livro {
  id: number;
  titulo: string;
  genero?: string;
  ano_publicacao?: number;
  quantidade_total: number;
  quantidade_disponivel: number;
  id_autor: number;  // <-- CORRIGIDO
  criado_em?: Date;

  constructor(dados: Livro) {
    this.id = dados.id;
    this.titulo = dados.titulo;
    this.genero = dados.genero;
    this.ano_publicacao = dados.ano_publicacao;
    this.quantidade_total = dados.quantidade_total;
    this.quantidade_disponivel = dados.quantidade_disponivel;
    this.id_autor = dados.id_autor;  // <-- CORRIGIDO
    this.criado_em = dados.criado_em;
  }

  get disponivel(): boolean {
    return this.quantidade_disponivel > 0;
  }
}