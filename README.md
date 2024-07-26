## Descrição

Repositório contendo o código fonte da API do [Knights Challenge](./Challenge.md). Construído com o NestJS framework + Fastify, utiliza o MongoDB como SGDB através do Prisma.io.

## Requisitos

- Node.js
- NPM

## Instalação

```bash
$ npm i && npm run db:generate
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

## Testes

```bash
# all tests
$ npm run test

# e2e tests
$ npm run test:e2e

# int tests
$ npm run test:int

# unit tests
$ npm run test:unit

# test coverage
$ npm run test:cov
```
