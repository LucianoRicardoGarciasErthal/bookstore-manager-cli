import { testarConexao, pool } from "./database/connection";
import { exibirMenuPrincipal } from "./menus/mainMenu";
import { InputHelper } from "./utils/inputHelper";

/**
 * Ponto de entrada da aplicação BookStore Manager CLI.
 * Responsável por estabelecer a conexão com o banco de dados
 * e iniciar o menu principal do sistema.
 */
async function main(): Promise<void> {
  console.log("Iniciando BookStore Manager CLI...");

  await testarConexao();
  await exibirMenuPrincipal();

  InputHelper.fechar();
  await pool.end();
  process.exit(0);
}

main().catch((error) => {
  console.error("❌ Erro fatal na aplicação:", error);
  process.exit(1);
});
