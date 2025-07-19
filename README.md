
# ONG-sys

Uma aplicação web full-stack para gerenciamento de ONGs, construída com React, Spring Boot e Docker.  

## 📄 Sobre o Projeto

O ONG-sys é um sistema de gestão completo, projetado para auxiliar organizações não governamentais a gerenciar seus recursos, doadores, voluntários, receptores e eventos de forma centralizada e eficiente.

A aplicação foi desenvolvida do zero, abrangendo desde a modelagem do banco de dados relacional, passando pela construção de uma API REST robusta com regras de negócio complexas, até a criação de uma interface de usuário moderna, reativa e interativa.

## 🏁 Como Executar o Projeto

Graças ao Docker, rodar este projeto é incrivelmente simples.

**Pré-requisitos:**
- [Git](https://git-scm.com/)
- [Docker](https://www.docker.com/products/docker-desktop/)
- [Docker Compose](https://docs.docker.com/compose/) (geralmente já vem com o Docker Desktop)

**Passo a Passo**

- Clone o repositório:
```git clone https://github.com/rianpuc/ONG-sys.git``` 

- Navegue até a pasta do projeto:
```cd ONG-sys-main```

- Construa as imagens e inicie os containers:
```docker-compose up --build```

*A primeira execução pode demorar alguns minutos, pois o Docker irá baixar as imagens base e construir os projetos Java e React.*

**Acessando a Aplicação**

Após a conclusão do comando acima, a aplicação estará no ar!
- Frontend (Site): http://localhost:5173
- Backend (API): http://localhost:8080/api
Banco de Dados (para acesso via Workbench):
- Host: localhost
- Porta: 3305
- Usuário: admin
- Senha: admin

## ✨ Funcionalidades

Dashboard Interativo: Visualização rápida de estatísticas chave, como balanço mensal de doações, itens em estoque e próximos eventos.

CRUD Completo: Gestão completa (Criar, Ler, Atualizar, Deletar) para todas as entidades principais da ONG:
- Doadores (Pessoas Físicas e Jurídicas)
- Itens (com controle de estoque)
- Voluntários (com alocação de função)
- Receptores
- Eventos
- Doações (com múltiplos itens)
- Entregas (com múltiplos itens)

Busca Avançada: Sistema de filtragem dinâmico em todas as tabelas, permitindo buscas por nome, tipo, data e outros critérios.

Lógica de Negócio Complexa: O sistema lida com regras como atualização automática de estoque, validação de dados polimórficos (CPF/CNPJ) e transações seguras no banco de dados.

Interface Moderna: UI construída com componentes reutilizáveis, modais, carrossel de acesso rápido e design responsivo.

## 🚀 Tecnologias Utilizadas

Este projeto é uma aplicação full-stack que utiliza um ecossistema moderno de tecnologias.

### Backend
- Java 17
- Spring Boot 3: Para a criação da API REST.
- Spring Data JPA / Hibernate: Para o mapeamento objeto-relacional e persistência de dados.
- Maven: Para gerenciamento de dependências e build do projeto.

### Frontend
- React com Typescript
- Vite: Como ferramenta de build e servidor de desenvolvimento.
- Tailwind CSS: Para estilização utility-first.

### Banco de dados
- MySQL 8

### Ambiente
- Docker & Docker Compose: A aplicação é totalmente containerizada, garantindo um ambiente de desenvolvimento e produção consistente e fácil de configurar.
- Nginx: Servidor web leve para servir a aplicação React de produção.

## 📁 Estrutura de Pastas

O repositório está organizado da seguinte forma:

```
.
├── backend/                # Contém todo o código do Spring Boot
├── frontend/               # Contém todo o código do React + Vite
├── sqls/                   # Scripts .sql para criação do schema e população inicial
├── docker-compose.yml      # Orquestra todos os containers
└── README.md
```

## 📫 Contato

**GitHub:** [rianpuc](https://github.com/rianpuc)

**LinkedIn:** [perfil](https://www.linkedin.com/in/riandll/)

**E-mail:** rianeduardotec@gmail.com
