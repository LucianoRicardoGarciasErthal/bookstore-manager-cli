-- =========================================================
-- BookStore Manager CLI - Script de criação do banco de dados
-- =========================================================
-- Este script cria toda a estrutura necessária para a aplicação.
-- Execute com: psql -U <usuario> -d <banco> -f src/database/schema.sql

-- Remove as tabelas caso já existam (permite recriar o banco do zero)
DROP TABLE IF EXISTS emprestimos CASCADE;
DROP TABLE IF EXISTS livros CASCADE;
DROP TABLE IF EXISTS clientes CASCADE;
DROP TABLE IF EXISTS autores CASCADE;

-- =========================================================
-- Tabela: autores
-- =========================================================
CREATE TABLE autores (
    id              SERIAL PRIMARY KEY,
    nome            VARCHAR(150) NOT NULL,
    nacionalidade   VARCHAR(100),
    data_nascimento DATE,
    criado_em       TIMESTAMP NOT NULL DEFAULT NOW()
);

-- =========================================================
-- Tabela: livros
-- =========================================================
CREATE TABLE livros (
    id                     SERIAL PRIMARY KEY,
    titulo                 VARCHAR(200) NOT NULL,
    genero                 VARCHAR(80),
    ano_publicacao         INTEGER,
    quantidade_total       INTEGER NOT NULL DEFAULT 1 CHECK (quantidade_total >= 0),
    quantidade_disponivel  INTEGER NOT NULL DEFAULT 1 CHECK (quantidade_disponivel >= 0),
    autor_id               INTEGER NOT NULL REFERENCES autores(id) ON DELETE RESTRICT,
    criado_em              TIMESTAMP NOT NULL DEFAULT NOW()
);

-- =========================================================
-- Tabela: clientes
-- =========================================================
CREATE TABLE clientes (
    id         SERIAL PRIMARY KEY,
    nome       VARCHAR(150) NOT NULL,
    email      VARCHAR(150) NOT NULL UNIQUE,
    telefone   VARCHAR(20),
    criado_em  TIMESTAMP NOT NULL DEFAULT NOW()
);

-- =========================================================
-- Tabela: emprestimos
-- =========================================================
CREATE TABLE emprestimos (
    id                      SERIAL PRIMARY KEY,
    livro_id                INTEGER NOT NULL REFERENCES livros(id) ON DELETE RESTRICT,
    cliente_id              INTEGER NOT NULL REFERENCES clientes(id) ON DELETE RESTRICT,
    data_emprestimo         TIMESTAMP NOT NULL DEFAULT NOW(),
    data_devolucao_prevista DATE,
    data_devolucao          TIMESTAMP,
    status                  VARCHAR(20) NOT NULL DEFAULT 'ATIVO' CHECK (status IN ('ATIVO', 'DEVOLVIDO'))
);

-- =========================================================
-- Índices para otimizar consultas mais frequentes
-- =========================================================
CREATE INDEX idx_livros_autor_id ON livros(autor_id);
CREATE INDEX idx_emprestimos_livro_id ON emprestimos(livro_id);
CREATE INDEX idx_emprestimos_cliente_id ON emprestimos(cliente_id);
CREATE INDEX idx_emprestimos_status ON emprestimos(status);

-- =========================================================
-- Dados iniciais (opcional, apenas para facilitar testes manuais)
-- =========================================================
INSERT INTO autores (nome, nacionalidade, data_nascimento) VALUES
    ('Machado de Assis', 'Brasileira', '1839-06-21'),
    ('J.K. Rowling', 'Britânica', '1965-07-31'),
    ('George Orwell', 'Britânica', '1903-06-25');

INSERT INTO livros (titulo, genero, ano_publicacao, quantidade_total, quantidade_disponivel, autor_id) VALUES
    ('Dom Casmurro', 'Romance', 1899, 3, 3, 1),
    ('Harry Potter e a Pedra Filosofal', 'Fantasia', 1997, 5, 5, 2),
    ('1984', 'Distopia', 1949, 4, 4, 3);

INSERT INTO clientes (nome, email, telefone) VALUES
    ('Ana Souza', 'ana.souza@email.com', '(48) 99999-0001'),
    ('Bruno Lima', 'bruno.lima@email.com', '(48) 99999-0002');
