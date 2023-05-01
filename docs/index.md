# Set up server

## React installation with Vite

- yarn create vite

## Express installation

- npm init -y: creates package.json
- yarn add:
  - express: web framework
  - cors: for cross origin resource sharing
  - morgan: it allows us to log every request to the console
  - pg: for postgresql
  - dotenv: for loading environment variables from a .env
  - nodemon -D: for running our node through a live service so it refreshes every time we save.

## Set up database

- Create a database in postgresql
- Create a .env file in the root directory and add the following:

  ```bash
  DB_USER=your_username
  DB_PASSWORD=your_password
  DB_HOST=localhost
  DB_PORT=5432
  DB_DATABASE=your_database_name
  ```

- Create a db.js file in the root directory and add the following:

```javascript
  const { Pool } = require('pg');
  const dotenv = require('dotenv');
  dotenv.config();

```

## Install Prisma

- yarn add prisma typescript ts-node @types/node --save-dev