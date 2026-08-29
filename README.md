# Weather Integration API

> API REST para integração com dados climáticos, persistência em PostgreSQL e consulta dos dados através de endpoints RESTful.

---

## Sobre

Projeto desenvolvido para avaliação técnica de Desenvolvedor de Software Pleno para a GnTech.

A aplicação realiza a integração com uma API pública de clima, processa os dados recebidos, armazena as informações em PostgreSQL e disponibiliza os registros através de uma API REST.

---

## Arquitetura

```text
                         CLIENT
                           │
                           │ HTTP
                           ▼
                    ┌──────────────┐
                    │   Fastify    │
                    └──────┬───────┘
                           │
                           ▼
                    ┌──────────────┐
                    │    NestJS    │
                    │              │
                    │WeatherModule │
                    └──────┬───────┘
                           │
              ┌────────────┴────────────┐
              │                         │
              ▼                         ▼
       ┌──────────────┐         ┌──────────────┐
       │WeatherService│         │ PrismaService│
       └──────┬───────┘         └──────┬───────┘
              │                        │
              ▼                        ▼
       ┌──────────────┐         ┌──────────────┐
       │ OpenWeather  │         │  PostgreSQL  │
       │     API      │         │   Database   │
       └──────────────┘         └──────────────┘
```


## Estrutura do projeto

```text
weather-integration-api/
│
├── .husky/
│   └── pre-commit
│
├── prisma/
│   ├── migrations/
│   └── schema.prisma
│
├── src/
│   │
│   ├── config/
│   │   └── configuration.ts
│   │
│   ├── database/
│   │   └── prisma/
│   │       └── prisma.service.ts
│   │
│   ├── modules/
│   │   └── weather/
│   │       │
│   │       ├── controllers/
│   │       │   └── weather.controller.ts
│   │       │
│   │       ├── dto/
│   │       │   ├── create-weather.dto.ts
│   │       │   └── weather-query.dto.ts
│   │       │
│   │       ├── interfaces/
│   │       │   └── openweather-response.interface.ts
│   │       │
│   │       ├── services/
│   │       │   ├── openweather.service.ts
│   │       │   └── weather.service.ts
│   │       │
│   │       └── weather.module.ts
│   │
│   ├── app.module.ts
│   └── main.ts
│
├── .env
├── .gitignore
├── .swcrc
├── biome.json
├── docker-compose.yml
├── nest-cli.json
├── package.json
├── prisma.config.ts
├── tsconfig.json
├── vitest.config.ts
└── README.md
```

---

## Stack

| Tecnologia | Utilização |
|---|---|
| NestJS | Framework principal |
| Fastify | HTTP Adapter |
| TypeScript | Linguagem |
| SWC | Compilação |
| Prisma | ORM |
| PostgreSQL | Banco de dados |
| Docker | Ambiente de infraestrutura |
| Biome | Lint e formatação |
| Husky | Git Hooks |
| Vitest | Testes |

---

## Setup

### Requisitos

- Node.js 22+
- npm
- Docker

### Instalação

```bash
git clone https://github.com/joao-victor-ferreira/weather-integration-api.git

cd weather-integration-api

npm install
```

### Variáveis de ambiente

Crie um arquivo `.env` na raiz:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/weather_db"
```

### Banco de dados

Suba o PostgreSQL:

```bash
docker compose up -d
```

Verifique os containers:

```bash
docker compose ps
```

### Prisma

Validar o schema:

```bash
npx prisma validate
```

Gerar o Prisma Client:

```bash
npm run db:generate
```

Executar migrations:

```bash
npm run db:migrate
```

---

## Execução

Modo desenvolvimento:

```bash
npm run start:dev
```


## Comandos

**Qualidade**

```bash
npm run check       # verificar código
npm run check:fix   # corrigir problemas
npm run format       # formatar
```

**Testes**

```bash
npm test              # rodar testes
npm run test:watch    # modo watch
npm run test:cov      # cobertura
```

**Build**

```bash
npm run build       # gerar build
npm run start:prod  # executar produção
```

---
## Status

**Em desenvolvimento**

### Setup

- [x] Setup NestJS
- [x] Fastify
- [x] SWC
- [x] Biome
- [x] Husky
- [x] Vitest
- [x] Prisma
- [x] PostgreSQL
- [x] Docker
- [x] Configuração de ambiente

### Integração

- [x] Integração com WeatherAPI
- [x] Consulta de dados climáticos
- [x] Endpoint `GET /weather`
- [x] Persistência dos dados climáticos
- [x] Endpoint `POST /weather`
- [x] Endpoint `GET /weather/history`

### Documentação e Qualidade

- [x] Swagger
- [ ] Testes automatizados
- [ ] Testes E2E