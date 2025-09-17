# AGENTS.MD: Instruções para Jules

Olá! Este arquivo serve como um guia para você, Jules, me ajudar a trabalhar neste repositório. Siga estas instruções para garantir que possamos colaborar de forma eficaz.

## Sobre o Projeto

Este é um projeto de um sistema de fichas de RPG, composto por:
- **Backend:** Uma API construída com **Rust** e o framework **Loco**.
- **Frontend:** Um conjunto de páginas estáticas (HTML, CSS, JS) que consomem a API do backend.
- **Banco de Dados:** **PostgreSQL**, orquestrado via Docker.

O ambiente de desenvolvimento principal é gerenciado com **Docker e Docker Compose**.

## Configuração do Ambiente (Usando Docker)

Esta é a maneira recomendada e mais simples de configurar o ambiente de desenvolvimento.

**Pré-requisitos:**
- **Docker:** [Instruções de instalação](https://docs.docker.com/get-docker/)
- **Docker Compose** (geralmente incluído no Docker Desktop)

**Passos para Configuração:**
1.  **Execute o script de setup:**
    ```bash
    chmod +x setup.sh
    ./setup.sh
    ```
    Este script irá verificar se o Docker está rodando, criar um arquivo `.env` a partir do `.env.example` e iniciar os contêineres do banco de dados e do backend.

2.  **Verifique se os serviços estão rodando:**
    ```bash
    docker compose ps
    ```
    Você deve ver dois contêineres em execução: `rpg-postgres` e `rpg-backend-loco`.

## Desenvolvimento Local (Fora do Docker)

Se você precisar trabalhar diretamente no backend sem usar o contêiner do Docker, siga estes passos.

**Pré-requisitos:**
- **Rust:** [Instruções de instalação](https://www.rust-lang.org/tools/install)
- **Loco CLI:**
  ```bash
  cargo install loco-cli
  ```
- **PostgreSQL** rodando (pode ser o do Docker Compose).

**Passos para o Backend:**
1.  **Navegue até o diretório do backend:**
    ```bash
    cd backend-loco/ancient
    ```
2.  **Instale as dependências:**
    ```bash
    cargo build
    ```
3.  **Execute as migrações do banco de dados:**
    ```bash
    cargo loco db migrate
    ```
4.  **Execute os testes:**
    ```bash
    cargo test
    ```
5.  **Inicie o servidor de desenvolvimento:**
    ```bash
    cargo loco start
    ```
    O backend estará disponível em `http://localhost:5150`.

## Estrutura do Projeto

- `backend-loco/ancient/`: Contém todo o código-fonte do backend Rust.
  - `src/controllers/`: Lógica das rotas da API.
  - `src/models/`: Definições das entidades do banco de dados.
  - `migration/`: Scripts de migração do banco de dados.
  - `tests/`: Testes automatizados.
- `frontend/`: Contém os arquivos estáticos do frontend.
- `docker-compose.yaml`: Define os serviços do Docker (banco de dados e backend).
- `setup.sh`: Script para automatizar a configuração do ambiente.
- `.env.example`: Arquivo de exemplo para as variáveis de ambiente.

## Comandos Úteis

- **Iniciar todos os serviços (Docker):** `docker compose up -d`
- **Parar todos os serviços (Docker):** `docker compose down`
- **Ver logs dos serviços (Docker):** `docker compose logs -f`
- **Acessar o shell do backend (Docker):** `docker compose exec backend-loco /bin/bash`
- **Executar testes do backend:** `cd backend-loco/ancient && cargo test`
