import { pool } from "../database/connection";
import { Autor, AutorInput } from "../models/Autor";

/**
 * Responsável exclusivamente pela comunicação com o PostgreSQL
 * para a entidade Autor.
 */
export class AutorRepository {
  async criar(dados: AutorInput): Promise<Autor> {
    const query = `
      INSERT INTO autores (nome, nacionalidade, data_nascimento)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
    const valores = [dados.nome, dados.nacionalidade ?? null, dados.data_nascimento ?? null];
    const resultado = await pool.query<Autor>(query, valores);
    return resultado.rows[0];
  }

  async listarTodos(): Promise<Autor[]> {
    const query = `SELECT * FROM autores ORDER BY nome ASC;`;
    const resultado = await pool.query<Autor>(query);
    return resultado.rows;
  }

  async buscarPorId(id: number): Promise<Autor | null> {
    const query = `SELECT * FROM autores WHERE id = $1;`;
    const resultado = await pool.query<Autor>(query, [id]);
    return resultado.rows[0] ?? null;
  }

  async atualizar(id: number, dados: AutorInput): Promise<Autor | null> {
    const query = `
      UPDATE autores
      SET nome = $1, nacionalidade = $2, data_nascimento = $3
      WHERE id = $4
      RETURNING *;
    `;
    const valores = [dados.nome, dados.nacionalidade ?? null, dados.data_nascimento ?? null, id];
    const resultado = await pool.query<Autor>(query, valores);
    return resultado.rows[0] ?? null;
  }

  async remover(id: number): Promise<boolean> {
    const query = `DELETE FROM autores WHERE id = $1;`;
    const resultado = await pool.query(query, [id]);
    return (resultado.rowCount ?? 0) > 0;
  }

  async possuiLivrosVinculados(id: number): Promise<boolean> {
    // CORRIGIDO: 'autor_id' → 'id_autor'
    const query = `SELECT 1 FROM livros WHERE id_autor = $1 LIMIT 1;`;
    const resultado = await pool.query(query, [id]);
    return (resultado.rowCount ?? 0) > 0;
  }
}
