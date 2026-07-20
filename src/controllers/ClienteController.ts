import { ClienteService } from "../services/ClienteService";
import { InputHelper } from "../utils/inputHelper";
import { linhaSeparadora, titulo } from "../utils/formatters";
import { AppError } from "../utils/errors";

export class ClienteController {
  private service = new ClienteService();

  async cadastrar(): Promise<void> {
    console.log(titulo("Cadastrar Cliente"));
    try {
      const nome = await InputHelper.texto("Nome");
      const email = await InputHelper.texto("E-mail");
      const telefone = await InputHelper.textoOpcional("Telefone");

      const cliente = await this.service.cadastrar({ nome, email, telefone });
      console.log(`\n✅ Cliente cadastrado com sucesso! (id: ${cliente.id})`);
    } catch (error) {
      this.tratarErro(error);
    }
    await InputHelper.pausar();
  }

  async listar(): Promise<void> {
    console.log(titulo("Lista de Clientes"));
    try {
      const clientes = await this.service.listar();
      if (clientes.length === 0) {
        console.log("Nenhum cliente cadastrado.");
      } else {
        clientes.forEach((c) => {
          console.log(linhaSeparadora());
          console.log(`ID: ${c.id}`);
          console.log(`Nome: ${c.nome}`);
          console.log(`E-mail: ${c.email}`);
          console.log(`Telefone: ${c.telefone ?? "-"}`);
        });
        console.log(linhaSeparadora());
      }
    } catch (error) {
      this.tratarErro(error);
    }
    await InputHelper.pausar();
  }

  async consultarPorId(): Promise<void> {
    console.log(titulo("Consultar Cliente por ID"));
    try {
      const id = await InputHelper.inteiro("Informe o ID do cliente");
      const cliente = await this.service.buscarPorId(id);
      console.log(linhaSeparadora());
      console.log(`ID: ${cliente.id}`);
      console.log(`Nome: ${cliente.nome}`);
      console.log(`E-mail: ${cliente.email}`);
      console.log(`Telefone: ${cliente.telefone ?? "-"}`);
      console.log(linhaSeparadora());
    } catch (error) {
      this.tratarErro(error);
    }
    await InputHelper.pausar();
  }

  async atualizar(): Promise<void> {
    console.log(titulo("Atualizar Cliente"));
    try {
      const id = await InputHelper.inteiro("Informe o ID do cliente a ser atualizado");
      await this.service.buscarPorId(id);

      const nome = await InputHelper.texto("Novo nome");
      const email = await InputHelper.texto("Novo e-mail");
      const telefone = await InputHelper.textoOpcional("Novo telefone");

      const atualizado = await this.service.atualizar(id, { nome, email, telefone });
      console.log(`\n✅ Cliente atualizado com sucesso! (id: ${atualizado.id})`);
    } catch (error) {
      this.tratarErro(error);
    }
    await InputHelper.pausar();
  }

  async remover(): Promise<void> {
    console.log(titulo("Remover Cliente"));
    try {
      const id = await InputHelper.inteiro("Informe o ID do cliente a ser removido");
      const cliente = await this.service.buscarPorId(id);

      const confirmar = await InputHelper.confirmar(`Remover o cliente "${cliente.nome}"?`);
      if (!confirmar) {
        console.log("Operação cancelada.");
      } else {
        await this.service.remover(id);
        console.log("✅ Cliente removido com sucesso!");
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
