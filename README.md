# Arcane Grimoire

**Gerenciador de fichas de RPG para o sistema Mago: A Ascensão.**

Este projeto fornece um ambiente de desenvolvimento completo e containerizado para a aplicação Arcane Grimoire, utilizando Docker para gerenciar o backend em Rust e o banco de dados PostgreSQL.

## Pré-requisitos

Antes de começar, certifique-se de que você tem as seguintes ferramentas instaladas e rodando em seu sistema:

- **[Docker](https://docs.docker.com/get-docker/)**: A plataforma de containerização usada para rodar todos os serviços do projeto. O Docker Desktop para Windows e Mac já inclui o `docker-compose`.
- **[Git](https://git-scm.com/downloads)**: Para clonar o repositório.
- **Um terminal com Bash**:
    - **Linux/macOS**: Já vem instalado por padrão.
    - **Windows**: Recomendamos o uso do [Git Bash](https://gitforwindows.org/) (que é instalado com o Git) ou o [Windows Subsystem for Linux (WSL)](https://docs.microsoft.com/pt-br/windows/wsl/install).

## Como Começar

Siga os passos abaixo para configurar e rodar o ambiente de desenvolvimento localmente.

### 1. Clone o Repositório

Primeiro, clone este repositório para a sua máquina local:

```bash
git clone <URL_DO_SEU_REPOSITORIO>
cd arcane-grimoire
```

### 2. Execute o Script de Configuração

Nós criamos um script para automatizar todo o processo de configuração. Para executá-lo, primeiro dê a ele permissão de execução e depois o rode:

```bash
chmod +x setup.sh
./setup.sh
```

**O que o script faz?**

- **Verifica as dependências**: Confere se o Docker e o Docker Compose estão instalados e rodando.
- **Cria o arquivo `.env`**: Se o arquivo `.env` de configuração de ambiente não existir, ele será criado a partir do template `.env.example`. Este arquivo guarda as senhas e configurações dos bancos de dados.
- **Inicia os serviços**: Constrói as imagens dos containers (se necessário) e inicia todos os serviços em segundo plano usando `docker compose up -d --build`.

Após a execução do script, o ambiente estará pronto e rodando!

### 3. Acesse a Aplicação

- **Backend**: A API estará disponível em `http://localhost:5150`.
- **Banco de Dados (PostgreSQL)**: Acessível na porta `5432`.

## Comandos Úteis do Docker

Aqui estão alguns comandos úteis para gerenciar os seus containers:

- **Ver os logs em tempo real**:
  ```bash
  docker compose logs -f
  ```

- **Parar todos os serviços**:
  ```bash
  docker compose down
  ```

- **Listar containers em execução**:
  ```bash
  docker compose ps
  ```

## Acessando o Banco de Dados

Você pode se conectar diretamente ao banco de dados PostgreSQL que está rodando no container para fazer consultas ou verificar os dados.

As credenciais de acesso e o nome do banco são os que estão definidos no seu arquivo `.env`. Com base no `.env.example`, os valores padrão são:
- **Host**: `localhost`
- **Porta**: `5432`
- **Usuário**: `user`
- **Senha**: `changeme`
- **Banco de Dados**: `rpg_database`

Você pode usar uma ferramenta de sua preferência, como DBeaver, DataGrip, ou o próprio `psql` via Docker:

```bash
# Conecte-se ao container do Postgres
docker compose exec db psql -U user -d rpg_database
```

## Troubleshooting

Encontrou algum problema? Aqui estão algumas soluções para erros comuns:

- **Erro "port is already allocated" ou "address already in use"**:
  - **Causa**: Uma das portas que o Docker está tentando usar (`5150` para o backend ou `5432` para o banco) já está ocupada por outro processo em sua máquina.
  - **Solução**:
    1. Pare o processo que está usando a porta.
    2. Ou altere a porta no arquivo `docker-compose.yaml`. Por exemplo, mude `"5432:5432"` para `"5433:5432"` para expor o banco de dados na porta 5433 da sua máquina.

- **O script `setup.sh` falha com "permission denied"**:
  - **Causa**: O script não tem permissão de execução.
  - **Solução**: Rode `chmod +x setup.sh` antes de `./setup.sh`.

---
*Este projeto foi configurado para ser simples e rápido de iniciar. Se encontrar algum problema, verifique se o Docker está rodando corretamente.*
