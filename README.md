## Descrição

Repositório contendo o código fonte da API do [Knights Challenge](./challenge.md). Construído com o NestJS framework + Fastify, utiliza o MongoDB como SGDB através do Prisma.io.

# Requisitos

- Node.js
- Docker

## Instalação

```bash
$ npm install
```

## Iniciando o banco de dados

```bash
$ npm run db:generate
$ docker-compose up -d
$ npm run db:push
```

## Rodando a API

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
