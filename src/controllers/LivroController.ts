import { LivroService } from "../services/LivroService";
import { InputHelper } from "../utils/inputHelper";
import { formatarDisponibilidade, linhaSeparadora, titulo } from "../utils/formatters";
import { AppError } from "../utils/errors";

export class LivroController {
  private service = new LivroService();

  async cadastrar(): Promise<void> {
    console.log(titulo("Cadastrar Livro"));
    try {
      const titulo_livro = await InputHelper.texto("Título");
      const genero = await InputHelper.textoOpcional("Gênero");
      const ano_publicacao = await InputHelper.inteiroOpcional("Ano de publicação");
      const quantidade_total = await InputHelper.inteiro("Quantidade de exemplares");
      const autor_id = await InputHelper.inteiro("ID do autor");

      const livro = await this.service.cadastrar({
        titulo: titulo_livro,
        genero,
        ano_publicacao,
        quantidade_total,
        autor_id,
      });
      console.log(`\n✅ Livro cadastrado com sucesso! (id: ${livro.id})`);
    } catch (error) {
      this.tratarErro(error);
    }
    await InputHelper.pausar();
  }

  async listar(): Promise<void> {
    console.log(titulo("Lista de Livros"));
    try {
      const livros = await this.service.listar();
      if (livros.length === 0) {
        console.log("Nenhum livro cadastrado.");
      } else {
        livros.forEach((l) => {
          console.log(linhaSeparadora());
          console.log(`ID: ${l.id}`);
          console.log(`Título: ${l.titulo}`);
          console.log(`Autor: ${l.autor_nome}`);
          console.log(`Gênero: ${l.genero ?? "-"}`);
          console.log(`Ano: ${l.ano_publicacao ?? "-"}`);
          console.log(`Situação: ${formatarDisponibilidade(l.quantidade_disponivel)}`);
        });
        console.log(linhaSeparadora());
      }
    } catch (error) {
      this.tratarErro(error);
    }
    await InputHelper.pausar();
  }

  async consultarPorId(): Promise<void> {
    console.log(titulo("Consultar Livro por ID"));
    try {
      const id = await InputHelper.inteiro("Informe o ID do livro");
      const livro = await this.service.buscarPorId(id);
      console.log(linhaSeparadora());
      console.log(`ID: ${livro.id}`);
      console.log(`Título: ${livro.titulo}`);
      console.log(`Autor: ${livro.autor_nome}`);
      console.log(`Gênero: ${livro.genero ?? "-"}`);
      console.log(`Ano: ${livro.ano_publicacao ?? "-"}`);
      console.log(`Situação: ${formatarDisponibilidade(livro.quantidade_disponivel)}`);
      console.log(linhaSeparadora());
    } catch (error) {
      this.tratarErro(error);
    }
    await InputHelper.pausar();
  }

  async atualizar(): Promise<void> {
    console.log(titulo("Atualizar Livro"));
    try {
      const id = await InputHelper.inteiro("Informe o ID do livro a ser atualizado");
      await this.service.buscarPorId(id);

      const titulo_livro = await InputHelper.texto("Novo título");
      const genero = await InputHelper.textoOpcional("Novo gênero");
      const ano_publicacao = await InputHelper.inteiroOpcional("Novo ano de publicação");
      const autor_id = await InputHelper.inteiro("ID do autor");

      const atualizado = await this.service.atualizar(id, {
        titulo: titulo_livro,
        genero,
        ano_publicacao,
        quantidade_total: 0, // não utilizado no update (mantém o campo do tipo LivroInput)
        autor_id,
      });
      console.log(`\n✅ Livro atualizado com sucesso! (id: ${atualizado.id})`);
    } catch (error) {
      this.tratarErro(error);
    }
    await InputHelper.pausar();
  }

  async remover(): Promise<void> {
    console.log(titulo("Remover Livro"));
    try {
      const id = await InputHelper.inteiro("Informe o ID do livro a ser removido");
      const livro = await this.service.buscarPorId(id);

      const confirmar = await InputHelper.confirmar(`Remover o livro "${livro.titulo}"?`);
      if (!confirmar) {
        console.log("Operação cancelada.");
      } else {
        await this.service.remover(id);
        console.log("✅ Livro removido com sucesso!");
      }
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
