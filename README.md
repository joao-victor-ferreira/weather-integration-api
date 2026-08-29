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
                    │  Rate Limit  │
                    └──────┬───────┘
                           │
                           ▼
                    ┌──────────────┐
                    │    NestJS    │
                    │              │
                    │WeatherModule │
                    └──────┬───────┘
                           │
                           ▼
                    ┌──────────────┐
                    │WeatherController
                    └──────┬───────┘
                           │
                           ▼
                    ┌──────────────┐
                    │ WeatherService
                    └──────┬───────┘
                           │
              ┌────────────┴────────────┐
              │                         │
              ▼                         ▼
       ┌───────────────┐        ┌──────────────┐
       │WeatherApiService       │ PrismaService│
       └──────┬────────┘        └──────┬───────┘
              │                        │
              ▼                        ▼
       ┌──────────────┐         ┌──────────────┐
       │  WeatherAPI  │         │  PostgreSQL  │
       │  (externa)   │         │   Database   │
       └──────────────┘         └──────────────┘
```

---

## Diagrama de Sequência

### POST /weather

```mermaid
sequenceDiagram
    actor Client
    participant Fastify
    participant Controller as WeatherController
    participant DTO as DTO
    participant Service as WeatherService
    participant ApiService as WeatherApiService
    participant WeatherAPI as WeatherAPI
    participant Prisma as PrismaService
    participant DB as PostgreSQL

    Client->>Fastify: POST /weather
    Fastify->>Fastify: Verifica Rate Limit
    Fastify->>Controller: Encaminha requisição
    Controller->>DTO: Validação
    DTO-->>Controller: Dados validados
    Controller->>Service: createWeather(city)
    Service->>ApiService: getCurrentWeather(city)
    ApiService->>WeatherAPI: GET current.json
    WeatherAPI-->>ApiService: Dados climáticos
    ApiService-->>Service: Dados processados
    Service->>Prisma: create(weatherData)
    Prisma->>DB: INSERT
    DB-->>Prisma: Registro salvo
    Prisma-->>Service: Registro criado
    Service-->>Controller: Registro criado
    Controller-->>Client: 201 Created
```

### GET /weather/history

```mermaid
sequenceDiagram
    actor Client
    participant Fastify
    participant Controller as WeatherController
    participant DTO as WeatherHistoryQueryDto
    participant Service as WeatherService
    participant Prisma as PrismaService
    participant DB as PostgreSQL

    Client->>Fastify: GET /weather/history?page=1&limit=50
    Fastify->>Fastify: Verifica Rate Limit
    Fastify->>Controller: Encaminha requisição
    Controller->>DTO: Validação e transformação
    DTO-->>Controller: page=1, limit=50
    Controller->>Service: getWeatherHistory(page, limit)
    Service->>Prisma: findMany + count
    Prisma->>DB: SELECT + COUNT
    DB-->>Prisma: Registros + total
    Prisma-->>Service: Dados paginados
    Service-->>Controller: data + meta
    Controller-->>Client: 200 OK
```

---

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
│   │       ├── prisma.module.ts
│   │       └── prisma.service.ts
│   │
│   ├── modules/
│   │   └── weather/
│   │       │
│   │       ├── controllers/
│   │       │   ├── weather.controller.ts
│   │       │   └── weather.controller.spec.ts
│   │       │
│   │       ├── dto/
│   │       │   ├── create-weather.dto.ts
│   │       │   ├── weather-query.dto.ts
│   │       │   └── weather-response.dto.ts
|   |       |   └── weather-history-query.dto.ts
│   │       │
│   │       ├── interfaces/
│   │       │   └── weather-api-response.interface.ts
│   │       │
│   │       ├── services/
│   │       │   ├── weather-api.service.ts
│   │       │   ├── weather-api.service.spec.ts
│   │       │   ├── weather.service.ts
│   │       │   └── weather.service.spec.ts
│   │       │
│   │       └── weather.module.ts
│   │
│   ├── app.module.ts
│   └── main.ts
│
├── test/
│   └── app.e2e-spec.ts
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
| WeatherAPI | Provedor de dados climáticos |
| class-validator | Validação de DTOs |
| Docker | Ambiente de infraestrutura |
| Biome | Lint e formatação |
| Husky | Git Hooks |
| Vitest | Testes |
| Supertest | Testes E2E |
| Swagger | Documentação da API |
| @fastify/rate-limit | Controle de requisições |

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
PORT=3000
WEATHER_API_KEY=""
WEATHER_API_BASE_URL="https://api.weatherapi.com/v1"
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
npx prisma generate
```

Executar migrations:

```bash
npx prisma migrate dev
```

---

## Execução

Modo desenvolvimento:

```bash
npm run start:dev
```

API disponível em:

```text
http://localhost:3000
```

Documentação Swagger:

```text
http://localhost:3000/docs
```

---

## Comandos

**Qualidade**

```bash
npm run check       # verificar código
npm run check:fix   # corrigir problemas
npm run format      # formatar
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
- [x] Testes automatizados
- [x] Testes E2E
