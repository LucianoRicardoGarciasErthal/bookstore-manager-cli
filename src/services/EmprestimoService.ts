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
    // ✅ CORRIGIDO: dados.id_livro em vez de dados.livro_id
    const livro = await this.livroRepository.buscarPorId(dados.id_livro);
    if (!livro) {
      throw new AppError(`Livro com id ${dados.id_livro} não encontrado.`);
    }

    // ✅ CORRIGIDO: dados.id_cliente em vez de dados.cliente_id
    const cliente = await this.clienteRepository.buscarPorId(dados.id_cliente);
    if (!cliente) {
      throw new AppError(`Cliente com id ${dados.id_cliente} não encontrado.`);
    }

    // 3. Valida disponibilidade do livro
    if (livro.quantidade_disponivel <= 0) {
      throw new AppError(`O livro "${livro.titulo}" não possui unidades disponíveis no momento.`);
    }

    // 4. Valida data de devolução prevista, se informada
    if (dados.data_devolucao_prevista && !dataValida(dados.data_devolucao_prevista)) {
      throw new AppError("Data de devolução prevista inválida. Utilize o formato AAAA-MM-DD.");
    }

    // 5. Registra o empréstimo (agora com transação dentro do repository)
    // ✅ O repository já faz a transação e decrementa o estoque
    const emprestimo = await this.repository.criar(dados);

    return emprestimo;
  }

  async registrarDevolucao(id: number): Promise<Emprestimo> {
    const emprestimo = await this.repository.buscarPorId(id);
    if (!emprestimo) {
      throw new AppError(`Empréstimo com id ${id} não encontrado.`);
    }
    
    // ✅ CORRIGIDO: status 'finalizado' em vez de 'DEVOLVIDO'
    if (emprestimo.status === "finalizado") {
      throw new AppError("Este empréstimo já foi devolvido anteriormente.");
    }

    // ✅ O repository já faz a transação e incrementa o estoque
    const atualizado = await this.repository.registrarDevolucao(id);
    if (!atualizado) {
      throw new AppError("Não foi possível registrar a devolução.");
    }

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