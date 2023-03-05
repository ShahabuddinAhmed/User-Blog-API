# User-Blog-API

User Blog API

## Installation with Docker

1. Clone from git

2. cd into User-Blog-API

3. run `yarn install` to install all dependencies

## Running the app

```bash
# development mode with Dockerfile.dev
$ dokcer-compose up

# production mode with Dockerfile
$ dokcer-compose up
```

## Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

## Swagger UI Documentation

[Swagger UI Docs](http://localhost:3000/api/v1/docs)

## Kibana

[Kibana](http://0.0.0.0:5601/)
