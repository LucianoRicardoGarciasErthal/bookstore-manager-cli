faça a correção:
import { EmprestimoService } from "../services/EmprestimoService";
import { InputHelper } from "../utils/inputHelper";
import { formatarData, linhaSeparadora, titulo } from "../utils/formatters";
import { AppError } from "../utils/errors";

export class EmprestimoController {
  private service = new EmprestimoService();

  async registrarEmprestimo(): Promise<void> {
    console.log(titulo("Registrar Empréstimo"));
    try {
      const livro_id = await InputHelper.inteiro("ID do livro");
      const cliente_id = await InputHelper.inteiro("ID do cliente");
      const data_devolucao_prevista = await InputHelper.textoOpcional(
        "Data prevista de devolução (AAAA-MM-DD)"
      );

      const emprestimo = await this.service.registrarEmprestimo({
        livro_id,
        cliente_id,
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
