# Etapa 1: Builder - Instalar ferramentas e compilar a aplicação
#FROM rust:latest AS builder
FROM loco-base:latest AS builder

# Instala as ferramentas de linha de comando
#RUN cargo install loco
#RUN cargo install sea-orm-cli

# Define o diretório de trabalho dentro do container
WORKDIR /usr/src/app

# Copia os arquivos de configuração do projeto (Cargo.toml, Cargo.lock)
COPY Cargo.toml Cargo.lock ./

# Compila as dependências para otimizar o cache
#RUN mkdir -p src && echo "fn main() {}" > src/main.rs && cargo build --release

# Copia o restante do código-fonte
COPY . .

# Compila o binário final
RUN cargo build --release --bin ancient

# Etapa 2: Final - A imagem leve para produção
FROM debian:bookworm-slim

# Copia o binário compilado da etapa 'builder'
COPY --from=builder /usr/src/app/target/release/ancient /usr/local/bin/ancient

# Expõe a porta que o servidor irá rodar
EXPOSE 3000

# Comando para rodar a aplicação quando o container iniciar
CMD ["ancient"]