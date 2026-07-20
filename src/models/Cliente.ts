export interface Cliente {
  id: number;
  nome: string;
  email: string;
  telefone?: string;
  criado_em?: Date;
}

export interface ClienteInput {
  nome: string;
  email: string;
  telefone?: string;
}

export class ClienteModel implements Cliente {
  id: number;
  nome: string;
  email: string;
  telefone?: string;
  criado_em?: Date;

  constructor(dados: Cliente) {
    this.id = dados.id;
    this.nome = dados.nome;
    this.email = dados.email;
    this.telefone = dados.telefone;
    this.criado_em = dados.criado_em;
  }
}
