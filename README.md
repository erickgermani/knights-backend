# knights-backend

Repositório contendo o código fonte do back-end do [Knights Challenge](./Challenge.md). Construído com o NestJS framework + Fastify, utiliza o MongoDB como SGDB através do Prisma.io. Para visualizar o código fonte do front-end, [clique aqui](https://github.com/erickgermani/knights-frontend).

## Requisitos

- Node.js
- NPM

## Instalação

```bash
$ npm install
$ npm run db:generate
```

## Rodando o back-end

Garanta que a porta 3000 esteja livre.

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Documentação

Acesse a documentação em [http://localhost:3000/api](http://localhost:3000/api). O back-end precisa estar em execução.

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

## Formatação

```bash
$ npm run format
```

## Lint

```bash
$ npm run lint
```
