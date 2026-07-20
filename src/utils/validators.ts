/**
 * Valida se uma string não é vazia (após remover espaços).
 */
export function textoValido(valor: string | undefined | null): boolean {
  return typeof valor === "string" && valor.trim().length > 0;
}

/**
 * Valida formato básico de e-mail.
 */
export function emailValido(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

/**
 * Valida se um valor é um número inteiro positivo.
 */
export function inteiroPositivo(valor: number): boolean {
  return Number.isInteger(valor) && valor > 0;
}

/**
 * Valida um ID informado pelo usuário via terminal.
 * Retorna false para valores não numéricos (NaN) ou não positivos,
 * evitando que entradas inválidas cheguem até o banco de dados.
 */
export function idValido(valor: number): boolean {
  return Number.isInteger(valor) && valor > 0;
}

/**
 * Valida se um ano informado é plausível
 * (entre 1400 e o ano atual).
 */
export function anoValido(ano: number): boolean {
  const anoAtual = new Date().getFullYear();
  return Number.isInteger(ano) && ano >= 1400 && ano <= anoAtual;
}

/**
 * Valida se uma data no formato YYYY-MM-DD é válida.
 */
export function dataValida(data: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(data)) return false;
  const timestamp = Date.parse(data);
  return !Number.isNaN(timestamp);
}
