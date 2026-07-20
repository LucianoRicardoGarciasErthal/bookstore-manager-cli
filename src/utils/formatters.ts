/**
 * Formata uma data para o padrão brasileiro (dd/mm/aaaa).
 */
export function formatarData(data: Date | string | null | undefined): string {
  if (!data) return "-";
  const d = typeof data === "string" ? new Date(data) : data;
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleDateString("pt-BR");
}

/**
 * Formata um valor booleano de disponibilidade em texto amigável.
 */
export function formatarDisponibilidade(quantidadeDisponivel: number): string {
  return quantidadeDisponivel > 0
    ? `Disponível (${quantidadeDisponivel})`
    : "Indisponível";
}

/**
 * Cria uma linha separadora para deixar o terminal mais legível.
 */
export function linhaSeparadora(tamanho = 60): string {
  return "-".repeat(tamanho);
}

/**
 * Centraliza um título dentro de uma linha do terminal, com bordas.
 */
export function titulo(texto: string): string {
  const linha = "=".repeat(60);
  return `\n${linha}\n  ${texto.toUpperCase()}\n${linha}`;
}
