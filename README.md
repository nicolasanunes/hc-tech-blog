# Documentação do Projeto Tech Blog

## Concepção do Projeto
O Tech Blog foi idealizado para ser uma plataforma de publicação de artigos e compartilhamento de conhecimento interno, com foco em escalabilidade, segurança e facilidade de manutenção conforme desafio técnico proposto pela empresa Grão Direto em jan/2026. O objetivo é permitir a criação, edição, visualização e gerenciamento de artigos, comentários, usuários e tags, utilizando boas práticas de desenvolvimento backend e frontend.

## Decisões Técnicas
- **Backend:** Utilização do [NestJS](https://nestjs.com/) por sua arquitetura modular, suporte a TypeScript, injeção de dependências e integração facilitada com bancos de dados e autenticação JWT.
- **Frontend:** Uso do [Vue 3](https://vuejs.org/) com Vite para desenvolvimento rápido, componentização e reatividade, além de integração eficiente com APIs REST.
- **Banco de Dados:** Estrutura relacional com banco de dados MySQL em Docker, com entidades bem definidas (artigos, usuários, comentários, tags), facilitando consultas e integridade dos dados. 
- **Autenticação:** JWT para autenticação stateless e armazenamento em cookies HttpOnly, garantindo segurança e escalabilidade.
- **Docker:** Uso de Docker Compose para facilitar o setup do banco de dados MySQL em docker.

## Organização do Código
 - **hc-tech-blog-backend/**
   - `src/`
     - `articles/`, `comments/`, `tags/`, `users/`: Cada domínio possui controller, service, DTOs e entidades, seguindo o padrão modular do NestJS.
     - `db/`: Configuração do banco de dados e migrations.
     - `auth/`: Lida com autenticação, login e refresh token.
     - `utils/`: Funções utilitárias, como hash de senhas.

- **hc-tech-blog-frontend/**
  - `src/` 
    - `components/`: Componentes reutilizáveis (Navbar, mensagens, confirmações).
    - `views/`: Páginas principais (artigos, login, home).
    - `router/`: Gerenciamento de rotas.
    - `services/`: Comunicação com a API backend (simplificação para reutilização do axios em chamadas API, rotas da API).
    - `stores/`: Gerenciamento de estado (principalmente relacionado à autenticação).
    - `types/`: Tipagens TypeScript para maior segurança.

## Estrutura de Diretórios

```
hc-tech-blog/
├── hc-tech-blog-backend/
│   ├── src/
│   │   ├── articles/        # Funcionalidades de artigos (controller, service, DTOs, entidades)
│   │   ├── comments/        # Funcionalidades de comentários
│   │   ├── tags/            # Funcionalidades de tags
│   │   ├── users/           # Funcionalidades de usuários
│   │   ├── db/              # Configuração do banco de dados e migrations
│   │   ├── auth/            # Autenticação e autorização
│   │   └── utils/           # Funções utilitárias
│   ├── docker-compose.yaml  # Orquestração do banco de dados
│   └── ...                  # Outros arquivos de configuração
├── hc-tech-blog-frontend/
│   ├── src/
│   │   ├── components/      # Componentes reutilizáveis da interface
│   │   ├── views/           # Páginas principais do sistema
│   │   ├── router/          # Gerenciamento de rotas
│   │   ├── services/        # Comunicação com a API backend
│   │   ├── stores/          # Gerenciamento de estado global
│   │   ├── types/           # Tipagens TypeScript
│   │   └── assets/          # Arquivos estáticos (CSS, imagens)
│   └── ...                  # Configurações e arquivos públicos
└── README.md                # Documentação principal do projeto
```

Cada pasta foi nomeada para refletir claramente sua responsabilidade, facilitando a navegação, manutenção e escalabilidade do projeto.

## Justificativas das Principais Escolhas
- **NestJS:** Permite escalabilidade, testes e manutenção facilitada, além de ser amplamente adotado em projetos corporativos.
- **Vue 3 + Vite:** Proporciona desenvolvimento ágil, hot reload eficiente e ótima experiência para o desenvolvedor.
- **Separação clara de módulos:** Facilita a manutenção, testes e evolução do sistema.
- **DTOs e Entities:** Garantem validação e tipagem dos dados trafegados entre frontend, backend e banco de dados.
- **Docker:** Simplifica o deploy do banco de dados MySQL e garante que todos desenvolvedores utilizem o mesmo ambiente de banco de dados.  