import { EmprestimoRepository } from "../repositories/EmprestimoRepository";
import { LivroRepository } from "../repositories/LivroRepository";
import { ClienteRepository } from "../repositories/ClienteRepository";
import { Emprestimo, EmprestimoInput, EmprestimoDetalhado } from "../models/Emprestimo";
import { AppError } from "../utils/errors";
import { dataValida } from "../utils/validators";

export class EmprestimoService {
  private repository = new EmprestimoRepository();
  private livroRepository = new LivroRepository();
  private clienteRepository = new ClienteRepository();

  async registrarEmprestimo(dados: EmprestimoInput): Promise<Emprestimo> {
    // 1. Valida existência do livro
    const livro = await this.livroRepository.buscarPorId(dados.livro_id);
    if (!livro) {
      throw new AppError(`Livro com id ${dados.livro_id} não encontrado.`);
    }

    // 2. Valida existência do cliente
    const cliente = await this.clienteRepository.buscarPorId(dados.cliente_id);
    if (!cliente) {
      throw new AppError(`Cliente com id ${dados.cliente_id} não encontrado.`);
    }

    // 3. Valida disponibilidade do livro
    if (livro.quantidade_disponivel <= 0) {
      throw new AppError(`O livro "${livro.titulo}" não possui unidades disponíveis no momento.`);
    }

    // 4. Valida data de devolução prevista, se informada
    if (dados.data_devolucao_prevista && !dataValida(dados.data_devolucao_prevista)) {
      throw new AppError("Data de devolução prevista inválida. Utilize o formato AAAA-MM-DD.");
    }

    // 5. Registra o empréstimo e atualiza o estoque do livro
    const emprestimo = await this.repository.criar(dados);
    await this.livroRepository.decrementarDisponibilidade(dados.livro_id);

    return emprestimo;
  }

  async registrarDevolucao(id: number): Promise<Emprestimo> {
    const emprestimo = await this.repository.buscarPorId(id);
    if (!emprestimo) {
      throw new AppError(`Empréstimo com id ${id} não encontrado.`);
    }
    if (emprestimo.status === "DEVOLVIDO") {
      throw new AppError("Este empréstimo já foi devolvido anteriormente.");
    }

    const atualizado = await this.repository.registrarDevolucao(id);
    if (!atualizado) {
      throw new AppError("Não foi possível registrar a devolução.");
    }

    // Atualiza a quantidade disponível do livro
    await this.livroRepository.incrementarDisponibilidade(emprestimo.livro_id);

    return atualizado;
  }

  async listar(): Promise<EmprestimoDetalhado[]> {
    return this.repository.listarTodos();
  }

  async buscarPorId(id: number): Promise<EmprestimoDetalhado> {
    const emprestimo = await this.repository.buscarPorId(id);
    if (!emprestimo) {
      throw new AppError(`Empréstimo com id ${id} não encontrado.`);
    }
    return emprestimo;
  }
}
