# Weather Integration API

> API REST para integração com dados climáticos, persistência em PostgreSQL e consulta dos dados através de endpoints RESTful.

---

## Sobre

Projeto desenvolvido para avaliação técnica de Desenvolvedor de Software Pleno para a GnTech.

A aplicação realiza a integração com uma API pública de clima, processa os dados recebidos, armazena as informações em PostgreSQL e disponibiliza os registros através de uma API REST.

O ambiente de execução é totalmente automatizado via Docker: com um único comando, a API e o banco de dados sobem já configurados e prontos para uso.

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
├── .env.example
├── .gitignore
├── .swcrc
├── biome.json
├── docker-compose.yml
├── Dockerfile
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
| Docker | Orquestração automatizada do ambiente (API + PostgreSQL) |
| Biome | Lint e formatação |
| Husky | Git Hooks |
| Vitest | Testes |
| Supertest | Testes E2E |
| Swagger | Documentação da API |
| @fastify/rate-limit | Controle de requisições |

---

## Endpoints principais

| Método | Rota | Descrição |
|---|---|---|
| POST | `/weather` | Consulta o clima atual de uma cidade e persiste o registro no banco de dados |
| GET | `/weather/history` | Lista o histórico de registros climáticos salvos, com paginação (`page`, `limit`) |

> A descrição completa de cada endpoint, incluindo parâmetros e exemplos de resposta, está disponível no Swagger (`/docs`).

---

## Pré-requisitos

### Executando via Docker (recomendado)

- Docker
- Docker Compose

### Executando localmente (opcional, sem Docker completo)

- Node.js 22+
- npm
- Docker (para subir apenas o banco de dados, caso prefira rodar a API fora de containers)

---

## Variáveis de ambiente

O projeto utiliza um arquivo `.env` na raiz. Um arquivo `.env.example` é fornecido como referência e deve ser copiado antes da execução:

Variáveis utilizadas pela aplicação:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/weather_db"
PORT=3000
WEATHER_API_KEY=""
WEATHER_API_BASE_URL="https://api.weatherapi.com/v1"
```

- **DATABASE_URL**: string de conexão com o PostgreSQL.
- **PORT**: porta em que a API é exposta.
- **WEATHER_API_KEY**: chave de acesso à WeatherAPI. Deve ser gerada pelo próprio usuário em [weatherapi.com](https://www.weatherapi.com/) e preenchida no `.env`.
- **WEATHER_API_BASE_URL**: URL base da WeatherAPI utilizada pela aplicação.

> Ao executar o projeto com `docker compose up --build`, a API utiliza o PostgreSQL do próprio ambiente Docker. A comunicação entre os containers já é resolvida pelo `docker-compose.yml`, sem necessidade de configuração manual adicional.

---

## Execução com Docker

Fluxo recomendado para subir o ambiente completo (API + PostgreSQL) com o mínimo de passos:

**1. Clone o repositório**

```bash
git clone https://github.com/joao-victor-ferreira/weather-integration-api.git
cd weather-integration-api
```

**2. Crie o arquivo `.env` a partir do `.env.example`**

```bash
cp .env.example .env
```

**3. Configure a `WEATHER_API_KEY`**

Edite o `.env` e preencha `WEATHER_API_KEY` com sua chave da WeatherAPI.

**4. Suba o ambiente**

```bash
docker compose up --build
```

Esse único comando é responsável por:

- Criar o container do PostgreSQL.
- Criar o container da API.
- Configurar a comunicação entre a API e o banco de dados.
- Aguardar o PostgreSQL estar saudável antes de iniciar a API.
- Gerar o Prisma Client durante o build.
- Executar o build da aplicação.
- Inicializar a API.

**5. Verifique se os containers estão em execução**

```bash
docker compose ps
```

**6. Para parar o ambiente**

```bash
docker compose down
```

Após subir o ambiente, a API estará disponível em:

```text
http://localhost:3000
```

E a documentação Swagger em:

```text
http://localhost:3000/docs
```

---

## Execução local (sem Docker completo)

Caso prefira rodar a API diretamente com Node.js (por exemplo, para desenvolvimento com hot-reload), é possível manter o PostgreSQL em um container e executar a API localmente.

### Instalação

```bash
npm install
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

### Execução

```bash
npm run start:dev
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
- [x] Docker (API + banco automatizados via `docker compose up --build`)
- [x] Configuração de ambiente

### Integração

- [x] Integração com WeatherAPI
- [x] Consulta de dados climáticos
- [x] Persistência dos dados climáticos
- [x] Endpoint `POST /weather`
- [x] Endpoint `GET /weather/history`

### Documentação e Qualidade

- [x] Swagger
- [x] Testes automatizados
- [x] Testes E2E
