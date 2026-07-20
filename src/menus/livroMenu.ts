import { LivroController } from "../controllers/LivroController";
import { InputHelper } from "../utils/inputHelper";
import { titulo } from "../utils/formatters";

const controller = new LivroController();

export async function exibirMenuLivros(): Promise<void> {
  let continuar = true;

  while (continuar) {
    console.log(titulo("Menu - Livros"));
    console.log("1 - Cadastrar livro");
    console.log("2 - Listar livros");
    console.log("3 - Consultar livro por ID");
    console.log("4 - Atualizar livro");
    console.log("5 - Remover livro");
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
