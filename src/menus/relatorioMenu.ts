import { RelatorioController } from "../controllers/RelatorioController";
import { InputHelper } from "../utils/inputHelper";
import { titulo } from "../utils/formatters";

const controller = new RelatorioController();

export async function exibirMenuRelatorios(): Promise<void> {
  let continuar = true;

  while (continuar) {
    console.log(titulo("Menu - Relatórios"));
    console.log("1 - Livros disponíveis");
    console.log("2 - Livros emprestados");
    console.log("3 - Livros cadastrados por autor");
    console.log("4 - Quantidade de empréstimos por livro");
    console.log("5 - Clientes com empréstimos ativos");
    console.log("6 - Autores mais emprestados (diferencial)");
    console.log("0 - Voltar ao menu principal");

    const opcao = await InputHelper.opcaoMenu("Escolha uma opção");

    switch (opcao) {
      case "1":
        await controller.livrosDisponiveis();
        break;
      case "2":
        await controller.livrosEmprestados();
        break;
      case "3":
        await controller.livrosCadastradosPorAutor();
        break;
      case "4":
        await controller.quantidadeEmprestimosPorLivro();
        break;
      case "5":
        await controller.clientesComEmprestimosAtivos();
        break;
      case "6":
        await controller.autoresMaisEmprestados();
        break;
      case "0":
        continuar = false;
        break;
      default:
        console.log("Opção inválida. Tente novamente.");
    }
  }
}
