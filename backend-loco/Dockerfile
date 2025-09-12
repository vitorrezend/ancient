# Etapa 1: Builder - Instalar ferramentas e compilar a aplicação
FROM rust:latest AS builder

# Instala as ferramentas de linha de comando
# A pasta `backend-loco` já tem seu próprio Cargo.toml e dependências
RUN cargo install cargo-loco
RUN cargo install sea-orm-cli

# Define o diretório de trabalho dentro do container para a sua nova aplicação
WORKDIR /usr/src/app

# Copia os arquivos de configuração para que o Docker possa cachear as dependências
COPY Cargo.toml Cargo.lock ./

# Compila as dependências para otimizar o cache do Docker
RUN mkdir -p src
RUN echo "fn main() {}" > src/main.rs
RUN cargo build --release

# Copia o resto do código da sua pasta backend-loco
COPY . .

# Compila o binário final
RUN cargo build --release

# Etapa 2: Final - A imagem leve para produção
FROM debian:bookworm-slim

# Copia o binário compilado da etapa 'builder'
# Substitua `nome-do-seu-binario` pelo nome do seu projeto,
# que geralmente é o nome da pasta (loco-backend, por exemplo)
COPY --from=builder /usr/src/app/target/release/loco-backend /usr/local/bin/loco-backend

# Expõe a porta que o seu servidor irá rodar
EXPOSE 3000

# Comando para rodar a aplicação quando o container iniciar
CMD ["loco-backend"]