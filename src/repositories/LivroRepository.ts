import { pool } from "../database/connection";
import { Livro, LivroInput, LivroComAutor } from "../models/Livro";

/**
 * Responsável exclusivamente pela comunicação com o PostgreSQL
 * para a entidade Livro.
 */
export class LivroRepository {
  async criar(dados: LivroInput): Promise<Livro> {
    const query = `
      INSERT INTO livros (titulo, genero, ano_publicacao, quantidade_total, quantidade_disponivel, autor_id)
      VALUES ($1, $2, $3, $4, $4, $5)
      RETURNING *;
    `;
    const valores = [
      dados.titulo,
      dados.genero ?? null,
      dados.ano_publicacao ?? null,
      dados.quantidade_total,
      dados.autor_id,
    ];
    const resultado = await pool.query<Livro>(query, valores);
    return resultado.rows[0];
  }

  async listarTodos(): Promise<LivroComAutor[]> {
    const query = `
      SELECT l.*, a.nome AS autor_nome
      FROM livros l
      INNER JOIN autores a ON a.id = l.autor_id
      ORDER BY l.titulo ASC;
    `;
    const resultado = await pool.query<LivroComAutor>(query);
    return resultado.rows;
  }

  async buscarPorId(id: number): Promise<LivroComAutor | null> {
    const query = `
      SELECT l.*, a.nome AS autor_nome
      FROM livros l
      INNER JOIN autores a ON a.id = l.autor_id
      WHERE l.id = $1;
    `;
    const resultado = await pool.query<LivroComAutor>(query, [id]);
    return resultado.rows[0] ?? null;
  }

  async atualizar(id: number, dados: LivroInput): Promise<Livro | null> {
    const query = `
      UPDATE livros
      SET titulo = $1, genero = $2, ano_publicacao = $3, autor_id = $4
      WHERE id = $5
      RETURNING *;
    `;
    const valores = [dados.titulo, dados.genero ?? null, dados.ano_publicacao ?? null, dados.autor_id, id];
    const resultado = await pool.query<Livro>(query, valores);
    return resultado.rows[0] ?? null;
  }

  async remover(id: number): Promise<boolean> {
    const query = `DELETE FROM livros WHERE id = $1;`;
    const resultado = await pool.query(query, [id]);
    return (resultado.rowCount ?? 0) > 0;
  }

  async decrementarDisponibilidade(id: number): Promise<void> {
    const query = `
      UPDATE livros
      SET quantidade_disponivel = quantidade_disponivel - 1
      WHERE id = $1;
    `;
    await pool.query(query, [id]);
  }

  async incrementarDisponibilidade(id: number): Promise<void> {
    const query = `
      UPDATE livros
      SET quantidade_disponivel = quantidade_disponivel + 1
      WHERE id = $1;
    `;
    await pool.query(query, [id]);
  }

  async possuiEmprestimosVinculados(id: number): Promise<boolean> {
    const query = `SELECT 1 FROM emprestimos WHERE livro_id = $1 LIMIT 1;`;
    const resultado = await pool.query(query, [id]);
    return (resultado.rowCount ?? 0) > 0;
  }
}
