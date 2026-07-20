import { RelatorioService } from "../services/RelatorioService";
import { InputHelper } from "../utils/inputHelper";
import { linhaSeparadora, titulo } from "../utils/formatters";
import { AppError } from "../utils/errors";

export class RelatorioController {
  private service = new RelatorioService();

  private exibirLista(dados: Record<string, unknown>[]): void {
    if (dados.length === 0) {
      console.log("Nenhum registro encontrado.");
      return;
    }
    dados.forEach((linha) => {
      console.log(linhaSeparadora());
      Object.entries(linha).forEach(([chave, valor]) => {
        console.log(`${chave}: ${valor}`);
      });
    });
    console.log(linhaSeparadora());
  }

  async livrosDisponiveis(): Promise<void> {
    console.log(titulo("Relatório: Livros Disponíveis"));
    try {
      this.exibirLista(await this.service.livrosDisponiveis());
    } catch (error) {
      this.tratarErro(error);
    }
    await InputHelper.pausar();
  }

  async livrosEmprestados(): Promise<void> {
    console.log(titulo("Relatório: Livros Emprestados"));
    try {
      this.exibirLista(await this.service.livrosEmprestados());
    } catch (error) {
      this.tratarErro(error);
    }
    await InputHelper.pausar();
  }

  async livrosCadastradosPorAutor(): Promise<void> {
    console.log(titulo("Relatório: Livros Cadastrados por Autor"));
    try {
      this.exibirLista(await this.service.livrosCadastradosPorAutor());
    } catch (error) {
      this.tratarErro(error);
    }
    await InputHelper.pausar();
  }

  async quantidadeEmprestimosPorLivro(): Promise<void> {
    console.log(titulo("Relatório: Quantidade de Empréstimos por Livro"));
    try {
      this.exibirLista(await this.service.quantidadeEmprestimosPorLivro());
    } catch (error) {
      this.tratarErro(error);
    }
    await InputHelper.pausar();
  }

  async clientesComEmprestimosAtivos(): Promise<void> {
    console.log(titulo("Relatório: Clientes com Empréstimos Ativos"));
    try {
      this.exibirLista(await this.service.clientesComEmprestimosAtivos());
    } catch (error) {
      this.tratarErro(error);
    }
    await InputHelper.pausar();
  }

  async autoresMaisEmprestados(): Promise<void> {
    console.log(titulo("Relatório: Autores Mais Emprestados"));
    try {
      this.exibirLista(await this.service.autoresMaisEmprestados());
    } catch (error) {
      this.tratarErro(error);
    }
    await InputHelper.pausar();
  }

  private tratarErro(error: unknown): void {
    if (error instanceof AppError) {
      console.log(`\n⚠️  ${error.message}`);
    } else {
      console.error("\n❌ Ocorreu um erro inesperado:", (error as Error).message);
    }
  }
}
