import { AutorService } from "../services/AutorService";
import { InputHelper } from "../utils/inputHelper";
import { formatarData, linhaSeparadora, titulo } from "../utils/formatters";
import { AppError } from "../utils/errors";

export class AutorController {
  private service = new AutorService();

  async cadastrar(): Promise<void> {
    console.log(titulo("Cadastrar Autor"));
    try {
      const nome = await InputHelper.texto("Nome");
      const nacionalidade = await InputHelper.textoOpcional("Nacionalidade");
      const data_nascimento = await InputHelper.textoOpcional("Data de nascimento (AAAA-MM-DD)");

      const autor = await this.service.cadastrar({ nome, nacionalidade, data_nascimento });
      console.log(`\n✅ Autor cadastrado com sucesso! (id: ${autor.id})`);
    } catch (error) {
      this.tratarErro(error);
    }
    await InputHelper.pausar();
  }

  async listar(): Promise<void> {
    console.log(titulo("Lista de Autores"));
    try {
      const autores = await this.service.listar();
      if (autores.length === 0) {
        console.log("Nenhum autor cadastrado.");
      } else {
        autores.forEach((a) => {
          console.log(linhaSeparadora());
          console.log(`ID: ${a.id}`);
          console.log(`Nome: ${a.nome}`);
          console.log(`Nacionalidade: ${a.nacionalidade ?? "-"}`);
          console.log(`Nascimento: ${formatarData(a.data_nascimento)}`);
        });
        console.log(linhaSeparadora());
      }
    } catch (error) {
      this.tratarErro(error);
    }
    await InputHelper.pausar();
  }

  async consultarPorId(): Promise<void> {
    console.log(titulo("Consultar Autor por ID"));
    try {
      const id = await InputHelper.inteiro("Informe o ID do autor");
      const autor = await this.service.buscarPorId(id);
      console.log(linhaSeparadora());
      console.log(`ID: ${autor.id}`);
      console.log(`Nome: ${autor.nome}`);
      console.log(`Nacionalidade: ${autor.nacionalidade ?? "-"}`);
      console.log(`Nascimento: ${formatarData(autor.data_nascimento)}`);
      console.log(linhaSeparadora());
    } catch (error) {
      this.tratarErro(error);
    }
    await InputHelper.pausar();
  }

  async atualizar(): Promise<void> {
    console.log(titulo("Atualizar Autor"));
    try {
      const id = await InputHelper.inteiro("Informe o ID do autor a ser atualizado");
      await this.service.buscarPorId(id);

      const nome = await InputHelper.texto("Novo nome");
      const nacionalidade = await InputHelper.textoOpcional("Nova nacionalidade");
      const data_nascimento = await InputHelper.textoOpcional("Nova data de nascimento (AAAA-MM-DD)");

      const atualizado = await this.service.atualizar(id, { nome, nacionalidade, data_nascimento });
      console.log(`\n✅ Autor atualizado com sucesso! (id: ${atualizado.id})`);
    } catch (error) {
      this.tratarErro(error);
    }
    await InputHelper.pausar();
  }

  async remover(): Promise<void> {
    console.log(titulo("Remover Autor"));
    try {
      const id = await InputHelper.inteiro("Informe o ID do autor a ser removido");
      const autor = await this.service.buscarPorId(id);

      const confirmar = await InputHelper.confirmar(`Remover o autor "${autor.nome}"?`);
      if (!confirmar) {
        console.log("Operação cancelada.");
      } else {
        await this.service.remover(id);
        console.log("✅ Autor removido com sucesso!");
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
