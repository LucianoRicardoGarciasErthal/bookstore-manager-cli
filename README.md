# 📚 BookStore Manager CLI

Sistema de linha de comando (CLI) para gerenciamento de uma pequena livraria, desenvolvido como projeto final do módulo de Fundamentos para Back-end (Node.js, TypeScript e PostgreSQL).

## 🎯 Objetivo

Substituir o controle manual de autores, livros, clientes e empréstimos por uma aplicação de terminal que persiste os dados em um banco de dados relacional PostgreSQL, aplicando arquitetura em camadas, princípios de Clean Code/SOLID e boas práticas de versionamento com Git/GitHub.

## 🛠️ Tecnologias utilizadas

- **Node.js**
- **TypeScript**
- **PostgreSQL**
- **pg** (driver de conexão com o PostgreSQL)
- **dotenv** (variáveis de ambiente)
- **readline-sync** (interação com o terminal)
- **ts-node-dev** (execução em ambiente de desenvolvimento)

## 📋 Requisitos para execução

- Node.js 18 ou superior
- PostgreSQL 13 ou superior instalado e em execução
- npm

## ⚙️ Instalação

1. Clone o repositório:
   ```bash
   git clone <url-do-repositorio>
   cd bookstore-manager-cli
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Copie o arquivo de variáveis de ambiente de exemplo e configure com os dados do seu banco:
   ```bash
   cp .env.example .env
   ```
   Edite o `.env` com as credenciais do seu PostgreSQL:
   ```
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=postgres
   DB_PASSWORD=postgres
   DB_NAME=bookstore_manager
   ```

## 🗄️ Configuração do banco de dados

1. Crie o banco de dados vazio:
   ```bash
   psql -U postgres -c "CREATE DATABASE bookstore_manager;"
   ```

2. Execute o script de criação das tabelas (contém também alguns dados de exemplo):
   ```bash
   psql -U postgres -d bookstore_manager -f src/database/schema.sql
   ```

3. *(Opcional)* Popule o banco com uma massa de dados maior — 1000 livros distribuídos entre 30 autores — útil para testar relatórios, paginação e performance com volume:
   ```bash
   psql -U postgres -d bookstore_manager -f src/database/seed-1000-livros.sql
   ```
   Esse script pode ser executado quantas vezes forem necessárias: ele insere 1000 novos livros a cada execução (não apaga os dados existentes).

> O banco de dados **deve** ser criado por meio do script `schema.sql` — não é permitido utilizar um banco previamente populado sem executá-lo.

## ▶️ Execução

Ambiente de desenvolvimento (recarrega automaticamente):
```bash
npm run dev
```

Compilar para produção:
```bash
npm run build
npm start
```

## 🏗️ Arquitetura do projeto

A aplicação segue uma **arquitetura em camadas**, separando responsabilidades entre interface (CLI), regras de negócio, acesso a dados e persistência no PostgreSQL:

```
Usuário (terminal)
      │
      ▼
  Menus  ──────────────►  Controllers (apresentação)
                                 │
                                 ▼
                            Services (regras de negócio)
                                 │
                                 ▼
                          Repositories (acesso a dados / SQL)
                                 │
                                 ▼
                            PostgreSQL
```

| Camada | Responsabilidade |
|---|---|
| **Main** | Inicia a aplicação, conecta ao banco e abre o menu principal. |
| **Menus** | Organiza a navegação entre os módulos do sistema no terminal. |
| **Controllers** | Capturam entradas do usuário e exibem as saídas no terminal, delegando a lógica aos services. |
| **Services** | Implementam as regras de negócio (validações, consistência dos dados). |
| **Repositories** | Executam os comandos SQL (INSERT, UPDATE, DELETE, SELECT) via `pg`. |
| **Models** | Interfaces, tipos e classes que representam as entidades do sistema. |
| **Database** | Configuração da conexão (`connection.ts`) e script de criação do banco (`schema.sql`). |
| **Utils** | Funções auxiliares reutilizáveis (validações, formatação, captura de entrada, erros). |

## 📁 Estrutura de pastas

```
bookstore-manager-cli/
├─ src/
│  ├─ main.ts
│  ├─ controllers/
│  │  ├─ AutorController.ts
│  │  ├─ LivroController.ts
│  │  ├─ ClienteController.ts
│  │  ├─ EmprestimoController.ts
│  │  └─ RelatorioController.ts
│  ├─ services/
│  │  ├─ AutorService.ts
│  │  ├─ LivroService.ts
│  │  ├─ ClienteService.ts
│  │  ├─ EmprestimoService.ts
│  │  └─ RelatorioService.ts
│  ├─ repositories/
│  │  ├─ AutorRepository.ts
│  │  ├─ LivroRepository.ts
│  │  ├─ ClienteRepository.ts
│  │  ├─ EmprestimoRepository.ts
│  │  └─ RelatorioRepository.ts
│  ├─ models/
│  │  ├─ Autor.ts
│  │  ├─ Livro.ts
│  │  ├─ Cliente.ts
│  │  └─ Emprestimo.ts
│  ├─ database/
│  │  ├─ connection.ts
│  │  └─ schema.sql
│  ├─ utils/
│  │  ├─ inputHelper.ts
│  │  ├─ validators.ts
│  │  ├─ formatters.ts
│  │  └─ errors.ts
│  └─ menus/
│     ├─ mainMenu.ts
│     ├─ autorMenu.ts
│     ├─ livroMenu.ts
│     ├─ clienteMenu.ts
│     ├─ emprestimoMenu.ts
│     └─ relatorioMenu.ts
├─ package.json
├─ tsconfig.json
├─ .env.example
├─ .gitignore
└─ README.md
```

## ✅ Funcionalidades implementadas

- **Autores:** cadastrar, listar, consultar por ID, atualizar, remover.
- **Livros:** cadastrar (vinculado a um autor existente), listar, consultar por ID, atualizar, remover.
- **Clientes:** cadastrar, listar, consultar por ID, atualizar, remover.
- **Empréstimos:** registrar empréstimo (com validação de existência de livro/cliente e disponibilidade), registrar devolução (com atualização automática do estoque), listar empréstimos.
- **Relatórios:**
  - Livros disponíveis
  - Livros emprestados
  - Livros cadastrados por autor
  - Quantidade de empréstimos por livro
  - Clientes com empréstimos ativos
  - Autores mais emprestados *(diferencial)*
- **Tratamento de erros:** mensagens claras para autor/livro/cliente/empréstimo inexistente, livro indisponível, e-mail duplicado, entre outros — sem interromper a execução da aplicação.
- **Programação assíncrona:** todas as operações de banco utilizam `async/await` com tratamento via `try/catch`.

## 💻 Exemplos de utilização

```
============================================================
  BOOKSTORE MANAGER CLI
============================================================
1 - Autores
2 - Livros
3 - Clientes
4 - Empréstimos
5 - Relatórios
0 - Encerrar aplicação

Escolha uma opção: 4

============================================================
  MENU - EMPRÉSTIMOS
============================================================
1 - Registrar empréstimo
2 - Registrar devolução
3 - Listar empréstimos
0 - Voltar ao menu principal

Escolha uma opção: 1

============================================================
  REGISTRAR EMPRÉSTIMO
============================================================
ID do livro: 2
ID do cliente: 1
Data prevista de devolução (AAAA-MM-DD) (opcional):

✅ Empréstimo registrado com sucesso! (id: 1)
```

## 👥 Autor

- [Nome do(a) integrante 1]
- [Nome do(a) integrante 2] *(se aplicável)*
- [Nome do(a) integrante 3] *(se aplicável)*

## 🔗 Link do Kanban

Quadro Kanban utilizado para organizar as tarefas do projeto [ https://trello.com/b/OiJApRRS/bookstore-manager-cli ]

## 🎥 Vídeo de apresentação

Link do vídeo de apresentação do projeto [ https://drive.google.com/drive/folders/1hA5o1Hj8gSLG5mJjYHhpBzzO1HI-DU9B?usp=sharing ]

🌳 Fluxo de versionamento (Git/GitHub)

Branches utilizadas: `main`, `develop`, `feat/autores`, `feat/livros`, `feat/clientes`, `feat/emprestimos`, `docs/readme`.

Fluxo: branch específica → `develop` → (ao final) `main`, com commits semânticos (`feat:`, `fix:`, `refactor:`, `docs:`, `style:`).
