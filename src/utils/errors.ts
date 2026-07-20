/**
 * Erro customizado para violações de regras de negócio
 * (ex.: autor inexistente, livro indisponível, etc.).
 * Permite diferenciar erros "esperados" de falhas inesperadas,
 * possibilitando exibir mensagens claras ao usuário sem
 * interromper a execução da aplicação.
 */
export class AppError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AppError";
  }
}
