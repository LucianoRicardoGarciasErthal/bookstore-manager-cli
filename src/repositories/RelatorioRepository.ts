import { pool } from "../database/connection";

/**
 * Responsável por consultas relacionais mais complexas,
 * utilizadas para gerar os relatórios gerenciais do sistema.
 * Utiliza JOIN, GROUP BY, ORDER BY, LIMIT e funções de agregação.
 */
export class RelatorioRepository {
  async livrosDisponiveis() {
    const query = `
      SELECT l.id, l.titulo, a.nome AS autor, l.quantidade_disponivel
      FROM livros l
      INNER JOIN autores a ON a.id = l.autor_id
      WHERE l.quantidade_disponivel > 0
      ORDER BY l.titulo ASC;
    `;
    const resultado = await pool.query(query);
    return resultado.rows;
  }

  async livrosEmprestados() {
    const query = `
      SELECT DISTINCT l.id, l.titulo, a.nome AS autor
      FROM emprestimos e
      INNER JOIN livros l ON l.id = e.livro_id
      INNER JOIN autores a ON a.id = l.autor_id
      WHERE e.status = 'ATIVO'
      ORDER BY l.titulo ASC;
    `;
    const resultado = await pool.query(query);
    return resultado.rows;
  }

  async livrosCadastradosPorAutor() {
    const query = `
      SELECT a.nome AS autor, COUNT(l.id) AS total_livros
      FROM autores a
      LEFT JOIN livros l ON l.autor_id = a.id
      GROUP BY a.nome
      ORDER BY total_livros DESC;
    `;
    const resultado = await pool.query(query);
    return resultado.rows;
  }

  async quantidadeEmprestimosPorLivro(limite = 10) {
    const query = `
      SELECT l.titulo, COUNT(e.id) AS total_emprestimos
      FROM livros l
      LEFT JOIN emprestimos e ON e.livro_id = l.id
      GROUP BY l.titulo
      ORDER BY total_emprestimos DESC
      LIMIT $1;
    `;
    const resultado = await pool.query(query, [limite]);
    return resultado.rows;
  }

  async clientesComEmprestimosAtivos() {
    const query = `
      SELECT c.nome, c.email, COUNT(e.id) AS emprestimos_ativos
      FROM clientes c
      INNER JOIN emprestimos e ON e.cliente_id = c.id
      WHERE e.status = 'ATIVO'
      GROUP BY c.nome, c.email
      ORDER BY emprestimos_ativos DESC;
    `;
    const resultado = await pool.query(query);
    return resultado.rows;
  }

  /**
   * Relatório diferencial: top autores mais emprestados.
   */
  async autoresMaisEmprestados(limite = 5) {
    const query = `
      SELECT a.nome AS autor, COUNT(e.id) AS total_emprestimos
      FROM emprestimos e
      INNER JOIN livros l ON l.id = e.livro_id
      INNER JOIN autores a ON a.id = l.autor_id
      GROUP BY a.nome
      ORDER BY total_emprestimos DESC
      LIMIT $1;
    `;
    const resultado = await pool.query(query, [limite]);
    return resultado.rows;
  }
}
