import { ClienteRepository } from "../repositories/ClienteRepository";
import { Cliente, ClienteInput } from "../models/Cliente";
import { AppError } from "../utils/errors";
import { textoValido, emailValido } from "../utils/validators";

export class ClienteService {
  private repository = new ClienteRepository();

  private async validarDados(dados: ClienteInput, idAtual?: number): Promise<void> {
    if (!textoValido(dados.nome)) {
      throw new AppError("O nome do cliente é obrigatório.");
    }
    if (!emailValido(dados.email)) {
      throw new AppError("E-mail inválido.");
    }

    // Regra de negócio: e-mail não pode se repetir entre clientes
    const clienteExistente = await this.repository.buscarPorEmail(dados.email);
    if (clienteExistente && clienteExistente.id !== idAtual) {
      throw new AppError("Já existe um cliente cadastrado com este e-mail.");
    }
  }

  async cadastrar(dados: ClienteInput): Promise<Cliente> {
    await this.validarDados(dados);
    return this.repository.criar(dados);
  }

  async listar(): Promise<Cliente[]> {
    return this.repository.listarTodos();
  }

  async buscarPorId(id: number): Promise<Cliente> {
    const cliente = await this.repository.buscarPorId(id);
    if (!cliente) {
      throw new AppError(`Cliente com id ${id} não encontrado.`);
    }
    return cliente;
  }

  async atualizar(id: number, dados: ClienteInput): Promise<Cliente> {
    await this.buscarPorId(id);
    await this.validarDados(dados, id);
    const atualizado = await this.repository.atualizar(id, dados);
    if (!atualizado) {
      throw new AppError("Não foi possível atualizar o cliente.");
    }
    return atualizado;
  }

  async remover(id: number): Promise<void> {
    await this.buscarPorId(id);

    const possuiEmprestimos = await this.repository.possuiEmprestimosVinculados(id);
    if (possuiEmprestimos) {
      throw new AppError(
        "Não é possível remover este cliente pois existem empréstimos vinculados a ele."
      );
    }

    const removido = await this.repository.remover(id);
    if (!removido) {
      throw new AppError("Não foi possível remover o cliente.");
    }
  }
}
