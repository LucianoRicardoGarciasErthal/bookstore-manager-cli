import { RelatorioRepository } from "../repositories/RelatorioRepository";

/**
 * Coordena as consultas de relatórios gerenciais.
 * Não possui regras de negócio complexas: delega diretamente
 * ao repository, que concentra as consultas SQL relacionais.
 */
export class RelatorioService {
  private repository = new RelatorioRepository();

  async livrosDisponiveis() {
    return this.repository.livrosDisponiveis();
  }

  async livrosEmprestados() {
    return this.repository.livrosEmprestados();
  }

  async livrosCadastradosPorAutor() {
    return this.repository.livrosCadastradosPorAutor();
  }

  async quantidadeEmprestimosPorLivro() {
    return this.repository.quantidadeEmprestimosPorLivro();
  }

  async clientesComEmprestimosAtivos() {
    return this.repository.clientesComEmprestimosAtivos();
  }

  async autoresMaisEmprestados() {
    return this.repository.autoresMaisEmprestados();
  }
}
