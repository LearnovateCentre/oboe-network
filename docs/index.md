# Oboe

## Set up server

### Express installation

- npm init -y: creates package.json
- yarn add:
  - express: web framework
  - cors: for cross origin resource sharing
  - morgan: it allows us to log every request to the console
  - dotenv: for loading environment variables from a .env
  - nodemon -D: for running our node through a live service so it refreshes every time we save.

### Install Prisma

- yarn add prisma -D
- npx prisma init: creates a prisma folder with a schema.prisma file and a .env file

### Set up database

- Create a PostgreSQL database in psql

```bash
psql -U <username> (username is postgres)
CREATE DATABASE <name>; (name is oboe)
```

- Set up the database in the schema.prisma file

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

- Add the database URL to the .env file

```bash
DATABASE_URL="postgresql://postgres:danipg@localhost:5432/oboe?schema=public"
```

### Create a migration

After creating the models in the schema.prisma file, we need to create a migration file.

- npx prisma migrate dev --name init

### Generate Prisma Client

- yarn add @prisma/client
- npx prisma generate

Whenever you make changes to your Prisma schema in the future, you manually need to invoke prisma generate in order to accommodate the changes in your Prisma Client API.

### Seed the database

## Set up client

### React installation with Vite

- yarn create vite client

### Install dependencies

- yarn add react react-dom react-router-dom dotenv

### Add eslint

- yarn add eslint -D
- npx eslint --init

### Add Material UI

- yarn add @mui/material @emotion/react @emotion/styled

### Add Material UI Icons

- yarn add @mui/icons-material

### Add Fonts

Material UI was designed with the Roboto font in mind. So we need to add it to our project.

In index.html:

```html
<link
  rel="stylesheet"
  href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
/>
/>
<style>
  * {
    font-family: 'Roboto', sans-serif;
  }
</style>
```

### jsconfig.json

Add to client the file jsconfig.json with the following content:  

```json
{
  "compilerOptions": {
    "baseUrl": "src"
  },
  "include": ["src"]
}
  ```

This is for absolute import

### Create a theme

