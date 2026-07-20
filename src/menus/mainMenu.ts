import { InputHelper } from "../utils/inputHelper";
import { titulo } from "../utils/formatters";
import { exibirMenuAutores } from "./autorMenu";
import { exibirMenuLivros } from "./livroMenu";
import { exibirMenuClientes } from "./clienteMenu";
import { exibirMenuEmprestimos } from "./emprestimoMenu";
import { exibirMenuRelatorios } from "./relatorioMenu";

export async function exibirMenuPrincipal(): Promise<void> {
  let continuar = true;

  while (continuar) {
    console.log(titulo("BookStore Manager CLI"));
    console.log("1 - Autores");
    console.log("2 - Livros");
    console.log("3 - Clientes");
    console.log("4 - Empréstimos");
    console.log("5 - Relatórios");
    console.log("0 - Encerrar aplicação");

    const opcao = await InputHelper.opcaoMenu("Escolha uma opção");

    switch (opcao) {
      case "1":
        await exibirMenuAutores();
        break;
      case "2":
        await exibirMenuLivros();
        break;
      case "3":
        await exibirMenuClientes();
        break;
      case "4":
        await exibirMenuEmprestimos();
        break;
      case "5":
        await exibirMenuRelatorios();
        break;
      case "0":
        continuar = false;
        console.log("\n👋 Encerrando o BookStore Manager CLI. Até logo!");
        break;
      default:
        console.log("Opção inválida. Tente novamente.");
    }
  }
}
