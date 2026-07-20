-- =========================================================
-- BookStore Manager CLI - Seed de dados (1000 livros)
-- =========================================================
-- Este script popula o banco com mais autores e 1000 livros
-- fictícios, distribuídos entre eles, para testes de volume,
-- paginação e relatórios (GROUP BY, LIMIT, agregações etc.).
--
-- Pré-requisito: o schema.sql já deve ter sido executado.
-- Execute com:
--   psql -U <usuario> -d <banco> -f src/database/seed-1000-livros.sql
-- =========================================================

-- 1) Garante uma base maior de autores (adiciona mais 27,
--    totalizando 30 autores, incluindo os 3 do schema.sql)
INSERT INTO autores (nome, nacionalidade, data_nascimento)
SELECT
    nome, nacionalidade, data_nascimento::date
FROM (VALUES
    ('Jorge Amado', 'Brasileira', '1912-08-10'),
    ('Clarice Lispector', 'Brasileira', '1920-12-10'),
    ('Cecília Meireles', 'Brasileira', '1901-11-07'),
    ('Carlos Drummond de Andrade', 'Brasileira', '1902-10-31'),
    ('Guimarães Rosa', 'Brasileira', '1908-06-27'),
    ('Agatha Christie', 'Britânica', '1890-09-15'),
    ('Arthur Conan Doyle', 'Britânica', '1859-05-22'),
    ('Jane Austen', 'Britânica', '1775-12-16'),
    ('Charles Dickens', 'Britânica', '1812-02-07'),
    ('Virginia Woolf', 'Britânica', '1882-01-25'),
    ('Ernest Hemingway', 'Americana', '1899-07-21'),
    ('Mark Twain', 'Americana', '1835-11-30'),
    ('Edgar Allan Poe', 'Americana', '1809-01-19'),
    ('Stephen King', 'Americana', '1947-09-21'),
    ('Toni Morrison', 'Americana', '1931-02-18'),
    ('Gabriel García Márquez', 'Colombiana', '1927-03-06'),
    ('Jorge Luis Borges', 'Argentina', '1899-08-24'),
    ('Isabel Allende', 'Chilena', '1942-08-02'),
    ('Fiódor Dostoiévski', 'Russa', '1821-11-11'),
    ('Liev Tolstói', 'Russa', '1828-09-09'),
    ('Franz Kafka', 'Tcheca', '1883-07-03'),
    ('Victor Hugo', 'Francesa', '1802-02-26'),
    ('Albert Camus', 'Francesa', '1913-11-07'),
    ('Umberto Eco', 'Italiana', '1932-01-05'),
    ('Haruki Murakami', 'Japonesa', '1949-01-12'),
    ('J.R.R. Tolkien', 'Britânica', '1892-01-03'),
    ('Neil Gaiman', 'Britânica', '1960-11-10')
) AS novos(nome, nacionalidade, data_nascimento)
WHERE NOT EXISTS (
    SELECT 1 FROM autores a WHERE a.nome = novos.nome
);

-- 2) Gera 1000 livros fictícios, distribuídos aleatoriamente
--    entre todos os autores cadastrados.
--    (Observação técnica: o valor de quantidade é calculado uma
--    única vez por linha em uma subquery e reaproveitado nas
--    colunas quantidade_total/quantidade_disponivel, evitando o
--    "achatamento" que o PostgreSQL faz em JOIN LATERAL não
--    correlacionado, que avaliaria random() apenas uma vez para
--    todas as 1000 linhas.)
INSERT INTO livros (titulo, genero, ano_publicacao, quantidade_total, quantidade_disponivel, autor_id)
SELECT
    dados.titulo,
    dados.genero,
    dados.ano_publicacao,
    dados.qtd,
    dados.qtd,
    dados.autor_id
FROM (
    SELECT
        INITCAP(
            (ARRAY['A Sombra', 'O Segredo', 'A Jornada', 'O Último', 'A Herança',
                   'O Mistério', 'A Travessia', 'O Reino', 'A Promessa', 'O Enigma',
                   'A Memória', 'O Destino', 'A Chama', 'O Labirinto', 'A Ponte',
                   'O Silêncio', 'A Tempestade', 'O Espelho', 'A Fronteira', 'O Vazio'
            ])[1 + floor(random() * 20)::int]
            || ' ' ||
            (ARRAY['do Norte', 'Perdido', 'Eterno', 'das Águas', 'de Cristal',
                   'Sombrio', 'Dourado', 'Esquecido', 'Infinito', 'de Ferro',
                   'das Estrelas', 'Distante', 'Oculto', 'Selvagem', 'Ancestral',
                   'da Meia-Noite', 'Invisível', 'de Pedra', 'Sagrado', 'Perdido no Tempo'
            ])[1 + floor(random() * 20)::int]
        ) || ' - Vol. ' || gs.i AS titulo,

        (ARRAY['Romance', 'Ficção Científica', 'Fantasia', 'Suspense', 'Terror',
               'Drama', 'Aventura', 'Biografia', 'Poesia', 'Policial',
               'Distopia', 'Realismo Mágico', 'História', 'Ensaio'
        ])[1 + floor(random() * 14)::int] AS genero,

        (1950 + floor(random() * 75)::int) AS ano_publicacao,

        (1 + floor(random() * 10)::int) AS qtd,

        (1 + floor(random() * (SELECT COUNT(*) FROM autores))::int) AS autor_id
    FROM generate_series(1, 1000) AS gs(i)
) AS dados;

-- 3) Conferência final
SELECT COUNT(*) AS total_livros FROM livros;
SELECT COUNT(*) AS total_autores FROM autores;
