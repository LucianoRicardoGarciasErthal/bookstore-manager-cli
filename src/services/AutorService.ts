import { AutorRepository } from "../repositories/AutorRepository";
import { Autor, AutorInput } from "../models/Autor";
import { AppError } from "../utils/errors";
import { textoValido, dataValida } from "../utils/validators";

export class AutorService {
  private repository = new AutorRepository();

  async cadastrar(dados: AutorInput): Promise<Autor> {
    if (!textoValido(dados.nome)) {
      throw new AppError("O nome do autor é obrigatório.");
    }
    if (dados.data_nascimento && !dataValida(dados.data_nascimento)) {
      throw new AppError("Data de nascimento inválida. Utilize o formato AAAA-MM-DD.");
    }
    return this.repository.criar(dados);
  }

  async listar(): Promise<Autor[]> {
    return this.repository.listarTodos();
  }

  async buscarPorId(id: number): Promise<Autor> {
    const autor = await this.repository.buscarPorId(id);
    if (!autor) {
      throw new AppError(`Autor com id ${id} não encontrado.`);
    }
    return autor;
  }

  async atualizar(id: number, dados: AutorInput): Promise<Autor> {
    await this.buscarPorId(id); // valida existência
    if (!textoValido(dados.nome)) {
      throw new AppError("O nome do autor é obrigatório.");
    }
    if (dados.data_nascimento && !dataValida(dados.data_nascimento)) {
      throw new AppError("Data de nascimento inválida. Utilize o formato AAAA-MM-DD.");
    }
    const atualizado = await this.repository.atualizar(id, dados);
    if (!atualizado) {
      throw new AppError("Não foi possível atualizar o autor.");
    }
    return atualizado;
  }

  async remover(id: number): Promise<void> {
    await this.buscarPorId(id); // valida existência

    const possuiLivros = await this.repository.possuiLivrosVinculados(id);
    if (possuiLivros) {
      throw new AppError(
        "Não é possível remover este autor pois existem livros vinculados a ele."
      );
    }

    const removido = await this.repository.remover(id);
    if (!removido) {
      throw new AppError("Não foi possível remover o autor.");
    }
  }
}
