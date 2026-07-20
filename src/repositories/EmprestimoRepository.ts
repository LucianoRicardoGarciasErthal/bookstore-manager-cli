import { pool } from "../database/connection";
import { Emprestimo, EmprestimoInput, EmprestimoDetalhado } from "../models/Emprestimo";

/**
 * Responsável exclusivamente pela comunicação com o PostgreSQL
 * para a entidade Emprestimo.
 */
export class EmprestimoRepository {
  async criar(dados: EmprestimoInput): Promise<Emprestimo> {
    const query = `
      INSERT INTO emprestimos (livro_id, cliente_id, data_devolucao_prevista, status)
      VALUES ($1, $2, $3, 'ATIVO')
      RETURNING *;
    `;
    const valores = [dados.livro_id, dados.cliente_id, dados.data_devolucao_prevista ?? null];
    const resultado = await pool.query<Emprestimo>(query, valores);
    return resultado.rows[0];
  }

  async listarTodos(): Promise<EmprestimoDetalhado[]> {
    const query = `
      SELECT
        e.*,
        l.titulo AS livro_titulo,
        c.nome AS cliente_nome
      FROM emprestimos e
      INNER JOIN livros l ON l.id = e.livro_id
      INNER JOIN clientes c ON c.id = e.cliente_id
      ORDER BY e.data_emprestimo DESC;
    `;
    const resultado = await pool.query<EmprestimoDetalhado>(query);
    return resultado.rows;
  }

  async buscarPorId(id: number): Promise<EmprestimoDetalhado | null> {
    const query = `
      SELECT
        e.*,
        l.titulo AS livro_titulo,
        c.nome AS cliente_nome
      FROM emprestimos e
      INNER JOIN livros l ON l.id = e.livro_id
      INNER JOIN clientes c ON c.id = e.cliente_id
      WHERE e.id = $1;
    `;
    const resultado = await pool.query<EmprestimoDetalhado>(query, [id]);
    return resultado.rows[0] ?? null;
  }

  async listarAtivosPorLivro(livroId: number): Promise<Emprestimo[]> {
    const query = `
      SELECT * FROM emprestimos
      WHERE livro_id = $1 AND status = 'ATIVO';
    `;
    const resultado = await pool.query<Emprestimo>(query, [livroId]);
    return resultado.rows;
  }

  async registrarDevolucao(id: number): Promise<Emprestimo | null> {
    const query = `
      UPDATE emprestimos
      SET status = 'DEVOLVIDO', data_devolucao = NOW()
      WHERE id = $1
      RETURNING *;
    `;
    const resultado = await pool.query<Emprestimo>(query, [id]);
    return resultado.rows[0] ?? null;
  }
}
