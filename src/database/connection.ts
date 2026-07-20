import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

/**
 * Pool de conexões com o PostgreSQL.
 * As credenciais são lidas do arquivo .env, evitando expor
 * informações sensíveis diretamente no código-fonte.
 */
export const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 5432,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

/**
 * Testa a conexão com o banco de dados.
 * Deve ser chamada na inicialização da aplicação (main.ts).
 */
export async function testarConexao(): Promise<void> {
  try {
    const client = await pool.connect();
    await client.query("SELECT NOW()");
    client.release();
    console.log("✅ Conexão com o PostgreSQL estabelecida com sucesso.");
  } catch (error) {
    console.error("❌ Falha ao conectar com o PostgreSQL:", (error as Error).message);
    process.exit(1);
  }
}
