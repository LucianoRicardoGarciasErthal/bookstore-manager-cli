import { pool } from "../database/connection";
import { Emprestimo, EmprestimoInput, EmprestimoDetalhado } from "../models/Emprestimo";

/**
 * Responsável exclusivamente pela comunicação com o PostgreSQL
 * para a entidade Emprestimo.
 */
export class EmprestimoRepository {
  async criar(dados: EmprestimoInput): Promise<Emprestimo> {
    const client = await pool.connect();
    try {
      // ✅ INICIA TRANSAÇÃO
      await client.query('BEGIN');

      // 1. Inserir empréstimo
      const queryInsert = `
        INSERT INTO emprestimos (id_livro, id_cliente, data_devolucao_prevista, status)
        VALUES ($1, $2, $3, 'ativo')
        RETURNING *;
      `;
      const valores = [dados.id_livro, dados.id_cliente, dados.data_devolucao_prevista ?? null];
      const resultado = await client.query<Emprestimo>(queryInsert, valores);
      const emprestimo = resultado.rows[0];

      // 2. Decrementar disponibilidade do livro
      await client.query(
        `UPDATE livros SET quantidade_disponivel = quantidade_disponivel - 1 WHERE id = $1`,
        [dados.id_livro]
      );

      // ✅ CONFIRMA TRANSAÇÃO
      await client.query('COMMIT');
      return emprestimo;

    } catch (error) {
      // ✅ DESFAZ TUDO EM CASO DE ERRO
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async listarTodos(): Promise<EmprestimoDetalhado[]> {
    const query = `
      SELECT
        e.*,
        l.titulo AS livro_titulo,
        c.nome AS cliente_nome
      FROM emprestimos e
      INNER JOIN livros l ON l.id = e.id_livro
      INNER JOIN clientes c ON c.id = e.id_cliente
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
      INNER JOIN livros l ON l.id = e.id_livro
      INNER JOIN clientes c ON c.id = e.id_cliente
      WHERE e.id = $1;
    `;
    const resultado = await pool.query<EmprestimoDetalhado>(query, [id]);
    return resultado.rows[0] ?? null;
  }

  async listarAtivosPorLivro(livroId: number): Promise<Emprestimo[]> {
    const query = `
      SELECT * FROM emprestimos
      WHERE id_livro = $1 AND status = 'ativo';
    `;
    const resultado = await pool.query<Emprestimo>(query, [livroId]);
    return resultado.rows;
  }

  async registrarDevolucao(id: number): Promise<Emprestimo | null> {
    const client = await pool.connect();
    try {
      // ✅ INICIA TRANSAÇÃO
      await client.query('BEGIN');

      // 1. Buscar o empréstimo para obter o id_livro
      const queryBuscar = `
        SELECT id_livro FROM emprestimos WHERE id = $1 AND status = 'ativo';
      `;
      const resultadoBusca = await client.query(queryBuscar, [id]);
      
      if (resultadoBusca.rows.length === 0) {
        throw new Error('Empréstimo não encontrado ou já devolvido.');
      }
      
      const id_livro = resultadoBusca.rows[0].id_livro;

      // 2. Atualizar status do empréstimo
      const queryUpdate = `
        UPDATE emprestimos
        SET status = 'finalizado', data_devolucao = NOW()
        WHERE id = $1
        RETURNING *;
      `;
      const resultado = await client.query<Emprestimo>(queryUpdate, [id]);
      const emprestimo = resultado.rows[0];

      // 3. Incrementar disponibilidade do livro
      await client.query(
        `UPDATE livros SET quantidade_disponivel = quantidade_disponivel + 1 WHERE id = $1`,
        [id_livro]
      );

      // ✅ CONFIRMA TRANSAÇÃO
      await client.query('COMMIT');
      return emprestimo;

    } catch (error) {
      // ✅ DESFAZ TUDO EM CASO DE ERRO
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
}