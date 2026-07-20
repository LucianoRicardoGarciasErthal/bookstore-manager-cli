import readline from "readline";

/**
 * Interface única e reutilizável de leitura do terminal (stdin/stdout).
 * Usar o módulo nativo "readline" (em vez de bibliotecas que dependem
 * de acesso direto a /dev/tty) garante que a aplicação funcione em
 * qualquer ambiente de execução: terminal comum, integrado da IDE,
 * ou entradas via pipe/redirecionamento.
 */
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function perguntar(pergunta: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(pergunta, (resposta) => resolve(resposta.trim()));
  });
}

/**
 * Centraliza a captura de entradas do usuário via terminal,
 * evitando duplicação de código nos controllers.
 */
export const InputHelper = {
  async texto(pergunta: string): Promise<string> {
    return perguntar(`${pergunta}: `);
  },

  async textoOpcional(pergunta: string): Promise<string | undefined> {
    const valor = await perguntar(`${pergunta} (opcional): `);
    return valor.length > 0 ? valor : undefined;
  },

  async numero(pergunta: string): Promise<number> {
    const valor = await perguntar(`${pergunta}: `);
    const numero = Number(valor);
    return Number.isNaN(numero) ? NaN : numero;
  },

  async inteiro(pergunta: string): Promise<number> {
    const valor = await perguntar(`${pergunta}: `);
    const numero = parseInt(valor, 10);
    return Number.isNaN(numero) ? NaN : numero;
  },

  async inteiroOpcional(pergunta: string): Promise<number | undefined> {
    const valor = await perguntar(`${pergunta} (opcional): `);
    if (valor.length === 0) return undefined;
    const numero = parseInt(valor, 10);
    return Number.isNaN(numero) ? undefined : numero;
  },

  async confirmar(pergunta: string): Promise<boolean> {
    const valor = await perguntar(`${pergunta} (s/n): `);
    return valor.trim().toLowerCase().startsWith("s");
  },

  async opcaoMenu(pergunta: string): Promise<string> {
    return perguntar(`\n${pergunta}: `);
  },

  async pausar(): Promise<void> {
    await perguntar("\nPressione ENTER para continuar...");
  },

  fechar(): void {
    rl.close();
  },
};
