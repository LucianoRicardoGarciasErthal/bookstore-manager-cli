import { ClienteController } from "../controllers/ClienteController";
import { InputHelper } from "../utils/inputHelper";
import { titulo } from "../utils/formatters";

const controller = new ClienteController();

export async function exibirMenuClientes(): Promise<void> {
  let continuar = true;

  while (continuar) {
    console.log(titulo("Menu - Clientes"));
    console.log("1 - Cadastrar cliente");
    console.log("2 - Listar clientes");
    console.log("3 - Consultar cliente por ID");
    console.log("4 - Atualizar cliente");
    console.log("5 - Remover cliente");
    console.log("0 - Voltar ao menu principal");

    const opcao = await InputHelper.opcaoMenu("Escolha uma opção");

    switch (opcao) {
      case "1":
        await controller.cadastrar();
        break;
      case "2":
        await controller.listar();
        break;
      case "3":
        await controller.consultarPorId();
        break;
      case "4":
        await controller.atualizar();
        break;
      case "5":
        await controller.remover();
        break;
      case "0":
        continuar = false;
        break;
      default:
        console.log("Opção inválida. Tente novamente.");
    }
  }
}
