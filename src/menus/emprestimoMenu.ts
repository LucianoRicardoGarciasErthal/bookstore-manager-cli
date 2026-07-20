import { EmprestimoController } from "../controllers/EmprestimoController";
import { InputHelper } from "../utils/inputHelper";
import { titulo } from "../utils/formatters";

const controller = new EmprestimoController();

export async function exibirMenuEmprestimos(): Promise<void> {
  let continuar = true;

  while (continuar) {
    console.log(titulo("Menu - Empréstimos"));
    console.log("1 - Registrar empréstimo");
    console.log("2 - Registrar devolução");
    console.log("3 - Listar empréstimos");
    console.log("0 - Voltar ao menu principal");

    const opcao = await InputHelper.opcaoMenu("Escolha uma opção");

    switch (opcao) {
      case "1":
        await controller.registrarEmprestimo();
        break;
      case "2":
        await controller.registrarDevolucao();
        break;
      case "3":
        await controller.listar();
        break;
      case "0":
        continuar = false;
        break;
      default:
        console.log("Opção inválida. Tente novamente.");
    }
  }
}
