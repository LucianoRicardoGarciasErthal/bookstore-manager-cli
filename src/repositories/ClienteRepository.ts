import { pool } from "../database/connection";
import { Cliente, ClienteInput } from "../models/Cliente";

/**
 * Responsável exclusivamente pela comunicação com o PostgreSQL
 * para a entidade Cliente.
 */
export class ClienteRepository {
  async criar(dados: ClienteInput): Promise<Cliente> {
    const query = `
      INSERT INTO clientes (nome, email, telefone)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
    const valores = [dados.nome, dados.email, dados.telefone ?? null];
    const resultado = await pool.query<Cliente>(query, valores);
    return resultado.rows[0];
  }

  async listarTodos(): Promise<Cliente[]> {
    const query = `SELECT * FROM clientes ORDER BY nome ASC;`;
    const resultado = await pool.query<Cliente>(query);
    return resultado.rows;
  }

  async buscarPorId(id: number): Promise<Cliente | null> {
    const query = `SELECT * FROM clientes WHERE id = $1;`;
    const resultado = await pool.query<Cliente>(query, [id]);
    return resultado.rows[0] ?? null;
  }

  async buscarPorEmail(email: string): Promise<Cliente | null> {
    const query = `SELECT * FROM clientes WHERE email = $1;`;
    const resultado = await pool.query<Cliente>(query, [email]);
    return resultado.rows[0] ?? null;
  }

  async atualizar(id: number, dados: ClienteInput): Promise<Cliente | null> {
    const query = `
      UPDATE clientes
      SET nome = $1, email = $2, telefone = $3
      WHERE id = $4
      RETURNING *;
    `;
    const valores = [dados.nome, dados.email, dados.telefone ?? null, id];
    const resultado = await pool.query<Cliente>(query, valores);
    return resultado.rows[0] ?? null;
  }

  async remover(id: number): Promise<boolean> {
    const query = `DELETE FROM clientes WHERE id = $1;`;
    const resultado = await pool.query(query, [id]);
    return (resultado.rowCount ?? 0) > 0;
  }

  async possuiEmprestimosVinculados(id: number): Promise<boolean> {
    // ✅ CORRIGIDO: cliente_id → id_cliente
    const query = `SELECT 1 FROM emprestimos WHERE id_cliente = $1 LIMIT 1;`;
    const resultado = await pool.query(query, [id]);
    return (resultado.rowCount ?? 0) > 0;
  }
}