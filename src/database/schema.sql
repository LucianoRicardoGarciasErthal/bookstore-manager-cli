-- =========================================================
-- BookStore Manager CLI - Script de criação do banco de dados
-- =========================================================
-- Este script cria toda a estrutura necessária para a aplicação.
-- Execute com: psql -U postgres -f src/database/schema.sql

-- =========================================================
-- Remove as tabelas caso já existam (permite recriar o banco do zero)
-- =========================================================
DROP TABLE IF EXISTS emprestimos CASCADE;
DROP TABLE IF EXISTS livros CASCADE;
DROP TABLE IF EXISTS clientes CASCADE;
DROP TABLE IF EXISTS autores CASCADE;

-- =========================================================
-- ==================== CRIAR BANCO ====================
-- =========================================================
-- ✅ CORRIGIDO: Verifica se o banco já existe antes de criar
SELECT 'CREATE DATABASE bookstore_manager'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'bookstore_manager')\gexec

-- Conecta ao banco
\c bookstore_manager;

-- =========================================================
-- ==================== TABELA AUTORES ====================
-- =========================================================
CREATE TABLE autores (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  nacionalidade VARCHAR(50),
  data_nascimento DATE,
  criado_em TIMESTAMP DEFAULT NOW()
);

-- =========================================================
-- ==================== TABELA LIVROS ====================
-- =========================================================
CREATE TABLE livros (
  id SERIAL PRIMARY KEY,
  titulo VARCHAR(150) NOT NULL,
  genero VARCHAR(50),
  ano_publicacao INTEGER,
  quantidade_total INTEGER NOT NULL DEFAULT 0,
  quantidade_disponivel INTEGER NOT NULL DEFAULT 0,
  id_autor INTEGER NOT NULL REFERENCES autores(id) ON DELETE RESTRICT,
  criado_em TIMESTAMP DEFAULT NOW(),
  CONSTRAINT chk_quantidade_total CHECK (quantidade_total >= 0),
  CONSTRAINT chk_quantidade_disponivel CHECK (quantidade_disponivel >= 0)
);

-- =========================================================
-- ==================== TABELA CLIENTES ====================
-- =========================================================
CREATE TABLE clientes (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  telefone VARCHAR(20),
  data_cadastro TIMESTAMP DEFAULT NOW()
);

-- =========================================================
-- ==================== TABELA EMPRÉSTIMOS ====================
-- =========================================================
CREATE TABLE emprestimos (
  id SERIAL PRIMARY KEY,
  id_livro INTEGER NOT NULL REFERENCES livros(id) ON DELETE RESTRICT,
  id_cliente INTEGER NOT NULL REFERENCES clientes(id) ON DELETE RESTRICT,
  data_emprestimo DATE DEFAULT NOW(),
  data_devolucao_prevista DATE,
  data_devolucao DATE,
  status VARCHAR(20) DEFAULT 'ativo',
  CONSTRAINT chk_status CHECK (status IN ('ativo', 'finalizado'))
);

-- =========================================================
-- ==================== ÍNDICES PARA PERFORMANCE ====================
-- =========================================================
CREATE INDEX idx_livros_id_autor ON livros(id_autor);
CREATE INDEX idx_emprestimos_id_livro ON emprestimos(id_livro);
CREATE INDEX idx_emprestimos_id_cliente ON emprestimos(id_cliente);
CREATE INDEX idx_emprestimos_status ON emprestimos(status);

-- =========================================================
-- ==================== DADOS INICIAIS (SEED) ====================
-- =========================================================

-- ==================== AUTORES ====================
INSERT INTO autores (nome, nacionalidade, data_nascimento) VALUES
  ('Machado de Assis', 'Brasileiro', '1839-06-21'),
  ('J.R.R. Tolkien', 'Inglês', '1892-01-03'),
  ('Jane Austen', 'Inglesa', '1775-12-16'),
  ('Clarice Lispector', 'Brasileira', '1920-12-10'),
  ('Gabriel García Márquez', 'Colombiano', '1927-03-06'),
  ('George Orwell', 'Inglês', '1903-06-25'),
  ('Agatha Christie', 'Inglesa', '1890-09-15'),
  ('J.K. Rowling', 'Inglesa', '1965-07-31')
ON CONFLICT DO NOTHING;

-- ==================== LIVROS ====================
INSERT INTO livros (titulo, genero, ano_publicacao, quantidade_total, quantidade_disponivel, id_autor) VALUES
  ('Dom Casmurro', 'Romance', 1899, 5, 5, 1),
  ('Memórias Póstumas de Brás Cubas', 'Romance', 1881, 3, 3, 1),
  ('O Alienista', 'Conto', 1882, 4, 4, 1),
  ('O Senhor dos Anéis: A Sociedade do Anel', 'Fantasia', 1954, 3, 3, 2),
  ('O Senhor dos Anéis: As Duas Torres', 'Fantasia', 1954, 3, 3, 2),
  ('O Senhor dos Anéis: O Retorno do Rei', 'Fantasia', 1955, 3, 3, 2),
  ('O Hobbit', 'Fantasia', 1937, 5, 5, 2),
  ('Orgulho e Preconceito', 'Romance', 1813, 4, 4, 3),
  ('Razão e Sensibilidade', 'Romance', 1811, 3, 3, 3),
  ('Emma', 'Romance', 1815, 2, 2, 3),
  ('A Hora da Estrela', 'Romance', 1977, 4, 4, 4),
  ('A Paixão Segundo G.H.', 'Romance', 1964, 2, 2, 4),
  ('Cem Anos de Solidão', 'Romance', 1967, 5, 5, 5),
  ('1984', 'Distopia', 1949, 6, 6, 6),
  ('A Revolução dos Bichos', 'Fábula', 1945, 4, 4, 6),
  ('Assassinato no Expresso Oriente', 'Suspense', 1934, 3, 3, 7),
  ('E Não Sobrou Nenhum', 'Suspense', 1939, 3, 3, 7),
  ('Harry Potter e a Pedra Filosofal', 'Fantasia', 1997, 7, 7, 8),
  ('Harry Potter e a Câmara Secreta', 'Fantasia', 1998, 5, 5, 8),
  ('Harry Potter e o Prisioneiro de Azkaban', 'Fantasia', 1999, 5, 5, 8)
ON CONFLICT DO NOTHING;

-- ==================== CLIENTES ====================
INSERT INTO clientes (nome, email, telefone) VALUES
  ('João Silva', 'joao.silva@email.com', '11999999999'),
  ('Maria Oliveira', 'maria.oliveira@email.com', '11988888888'),
  ('Carlos Souza', 'carlos.souza@email.com', '11977777777'),
  ('Ana Costa', 'ana.costa@email.com', '11966666666'),
  ('Pedro Santos', 'pedro.santos@email.com', '11955555555'),
  ('Juliana Lima', 'juliana.lima@email.com', '11944444444'),
  ('Fernando Alves', 'fernando.alves@email.com', '11933333333'),
  ('Camila Rocha', 'camila.rocha@email.com', '11922222222')
ON CONFLICT DO NOTHING;

-- ==================== EMPRÉSTIMOS ====================
INSERT INTO emprestimos (id_livro, id_cliente, data_emprestimo, data_devolucao_prevista, status) VALUES
  (1, 1, NOW() - INTERVAL '5 days', NOW() + INTERVAL '2 days', 'ativo'),
  (4, 2, NOW() - INTERVAL '3 days', NOW() + INTERVAL '4 days', 'ativo'),
  (8, 3, NOW() - INTERVAL '7 days', NOW() - INTERVAL '2 days', 'finalizado'),
  (14, 4, NOW() - INTERVAL '10 days', NOW() + INTERVAL '5 days', 'ativo'),
  (18, 5, NOW() - INTERVAL '1 day', NOW() + INTERVAL '6 days', 'ativo')
ON CONFLICT DO NOTHING;

-- ==================== ATUALIZAR DISPONIBILIDADE DOS LIVROS EMPRESTADOS ====================
UPDATE livros SET quantidade_disponivel = quantidade_disponivel - 1 WHERE id IN (1, 4, 14, 18);

-- ==================== VERIFICAR DADOS INSERIDOS ====================
SELECT 'Total de autores: ' || COUNT(*) FROM autores;
SELECT 'Total de livros: ' || COUNT(*) FROM livros;
SELECT 'Total de clientes: ' || COUNT(*) FROM clientes;
SELECT 'Total de empréstimos: ' || COUNT(*) FROM emprestimos;