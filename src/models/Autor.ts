export interface Autor {
  id: number;
  nome: string;
  nacionalidade?: string;
  data_nascimento?: string; // formato YYYY-MM-DD
  criado_em?: Date;
}

/**
 * DTO utilizado para criação/atualização de um autor,
 * sem o id (gerado automaticamente pelo banco).
 */
export interface AutorInput {
  nome: string;
  nacionalidade?: string;
  data_nascimento?: string;
}

export class AutorModel implements Autor {
  id: number;
  nome: string;
  nacionalidade?: string;
  data_nascimento?: string;
  criado_em?: Date;

  constructor(dados: Autor) {
    this.id = dados.id;
    this.nome = dados.nome;
    this.nacionalidade = dados.nacionalidade;
    this.data_nascimento = dados.data_nascimento;
    this.criado_em = dados.criado_em;
  }
}
