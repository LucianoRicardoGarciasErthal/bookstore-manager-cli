import { EmprestimoService } from "../services/EmprestimoService";
import { InputHelper } from "../utils/inputHelper";
import { formatarData, linhaSeparadora, titulo } from "../utils/formatters";
import { AppError } from "../utils/errors";

export class EmprestimoController {
  private service = new EmprestimoService();

  async registrarEmprestimo(): Promise<void> {
    console.log(titulo("Registrar Empréstimo"));
    try {
      const id_livro = await InputHelper.inteiro("ID do livro");

      if (isNaN(id_livro) || id_livro <= 0) {
        console.log("⚠️  ID do livro inválido. Deve ser um número positivo.");
        await InputHelper.pausar();
        return;
      }

      const id_cliente = await InputHelper.inteiro("ID do cliente");

      if (isNaN(id_cliente) || id_cliente <= 0) {
        console.log("⚠️  ID do cliente inválido. Deve ser um número positivo.");
        await InputHelper.pausar();
        return;
      }

      const data_devolucao_prevista = await InputHelper.textoOpcional(
        "Data prevista de devolução (AAAA-MM-DD)"
      );

      if (data_devolucao_prevista && !/^\d{4}-\d{2}-\d{2}$/.test(data_devolucao_prevista)) {
        console.log("⚠️  Formato de data inválido. Use AAAA-MM-DD (ex: 2024-12-31).");
        await InputHelper.pausar();
        return;
      }

      const emprestimo = await this.service.registrarEmprestimo({
        id_livro,
        id_cliente,
        data_devolucao_prevista,
      });
      console.log(`\n✅ Empréstimo registrado com sucesso! (id: ${emprestimo.id})`);
    } catch (error) {
      this.tratarErro(error);
    }
    await InputHelper.pausar();
  }

  async registrarDevolucao(): Promise<void> {
    console.log(titulo("Registrar Devolução"));
    try {
      const id = await InputHelper.inteiro("Informe o ID do empréstimo");

      if (isNaN(id) || id <= 0) {
        console.log("⚠️  ID inválido. Deve ser um número positivo.");
        await InputHelper.pausar();
        return;
      }

      await this.service.registrarDevolucao(id);
      console.log("\n✅ Devolução registrada com sucesso!");
    } catch (error) {
      this.tratarErro(error);
    }
    await InputHelper.pausar();
  }

  async listar(): Promise<void> {
    console.log(titulo("Lista de Empréstimos"));
    try {
      const emprestimos = await this.service.listar();
      if (emprestimos.length === 0) {
        console.log("Nenhum empréstimo cadastrado.");
      } else {
        emprestimos.forEach((e) => {
          console.log(linhaSeparadora());
          console.log(`ID: ${e.id}`);
          console.log(`Livro: ${e.livro_titulo}`);
          console.log(`Cliente: ${e.cliente_nome}`);
          console.log(`Status: ${e.status}`);
          console.log(`Data do empréstimo: ${formatarData(e.data_emprestimo)}`);
          console.log(`Devolução prevista: ${formatarData(e.data_devolucao_prevista)}`);
          console.log(`Devolução efetiva: ${formatarData(e.data_devolucao)}`);
        });
        console.log(linhaSeparadora());
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