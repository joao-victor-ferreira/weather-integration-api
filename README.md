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
                           ▼
                    ┌──────────────┐
                    │WeatherService│
                    └──────┬───────┘
                           │
              ┌────────────┴────────────┐
              │                         │
              ▼                         ▼
       ┌───────────────┐        ┌──────────────┐
       │WeatherApiSvc  │        │ PrismaService│
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
    participant DTO
    participant Service as WeatherService
    participant ApiService as WeatherApiService
    participant WeatherAPI as WeatherAPI (externa)
    participant Prisma as PrismaService
    participant DB as PostgreSQL

    Client->>Fastify: POST /weather { city: "Rio de Janeiro" }
    Fastify->>Controller: encaminha requisição
    Controller->>DTO: valida CreateWeatherDto
    DTO-->>Controller: dados validados
    Controller->>Service: createWeather(city)
    Service->>ApiService: fetchCurrentWeather(city)
    ApiService->>WeatherAPI: GET current.json?key=API_KEY&q=city
    WeatherAPI-->>ApiService: dados climáticos
    ApiService-->>Service: dados processados
    Service->>Prisma: create(weatherData)
    Prisma->>DB: INSERT INTO weather (...)
    DB-->>Prisma: registro salvo
    Prisma-->>Service: retorna registro criado
    Service-->>Controller: retorna registro
    Controller-->>Client: 201 Created (JSON)
```

### GET /weather/history

```mermaid
sequenceDiagram
    actor Client
    participant Fastify
    participant Controller as WeatherController
    participant Service as WeatherService
    participant Prisma as PrismaService
    participant DB as PostgreSQL

    Client->>Fastify: GET /weather/history
    Fastify->>Controller: encaminha requisição
    Controller->>Service: getHistory()
    Service->>Prisma: findMany()
    Prisma->>DB: SELECT * FROM weather
    DB-->>Prisma: registros armazenados
    Prisma-->>Service: lista de registros
    Service-->>Controller: retorna lista
    Controller-->>Client: 200 OK (JSON)
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
| Swagger | Documentação da API |

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
WEATHER_API_KEY="sua_chave_da_weatherapi"
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
