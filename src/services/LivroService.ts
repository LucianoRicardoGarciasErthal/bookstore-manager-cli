import { LivroRepository } from "../repositories/LivroRepository";
import { AutorRepository } from "../repositories/AutorRepository";
import { Livro, LivroInput, LivroComAutor } from "../models/Livro";
import { AppError } from "../utils/errors";
import { textoValido, inteiroPositivo, anoValido } from "../utils/validators";

export class LivroService {
  private repository = new LivroRepository();
  private autorRepository = new AutorRepository();

  private async validarDados(dados: LivroInput): Promise<void> {
    if (!textoValido(dados.titulo)) {
      throw new AppError("O título do livro é obrigatório.");
    }
    if (!inteiroPositivo(dados.quantidade_total)) {
      throw new AppError("A quantidade total deve ser um número inteiro maior que zero.");
    }
    if (dados.ano_publicacao && !anoValido(dados.ano_publicacao)) {
      throw new AppError("Ano de publicação inválido.");
    }

    // Regra de negócio: livro deve estar vinculado a um autor existente
    const autor = await this.autorRepository.buscarPorId(dados.autor_id);
    if (!autor) {
      throw new AppError(
        `Autor com id ${dados.autor_id} não encontrado. Cadastre o autor antes de vincular o livro.`
      );
    }
  }

  async cadastrar(dados: LivroInput): Promise<Livro> {
    await this.validarDados(dados);
    return this.repository.criar(dados);
  }

  async listar(): Promise<LivroComAutor[]> {
    return this.repository.listarTodos();
  }

  async buscarPorId(id: number): Promise<LivroComAutor> {
    const livro = await this.repository.buscarPorId(id);
    if (!livro) {
      throw new AppError(`Livro com id ${id} não encontrado.`);
    }
    return livro;
  }

  async atualizar(id: number, dados: LivroInput): Promise<Livro> {
    await this.buscarPorId(id);
    await this.validarDados(dados);
    const atualizado = await this.repository.atualizar(id, dados);
    if (!atualizado) {
      throw new AppError("Não foi possível atualizar o livro.");
    }
    return atualizado;
  }

  async remover(id: number): Promise<void> {
    await this.buscarPorId(id);

    const possuiEmprestimos = await this.repository.possuiEmprestimosVinculados(id);
    if (possuiEmprestimos) {
      throw new AppError(
        "Não é possível remover este livro pois existem empréstimos vinculados a ele."
      );
    }

    const removido = await this.repository.remover(id);
    if (!removido) {
      throw new AppError("Não foi possível remover o livro.");
    }
  }
}
