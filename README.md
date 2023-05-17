# oboe-network

1. Use VisualCode tool to clone the repository to your local machine (or run the appropriate command):

### git clone https://github.com/LearnovateCentre/oboe-network.git

2. Move to client

### cd .\client\

3. Install dependencies and run

### npm install

4. Move back to server and do same

### cd .\server\
### npm install

5. Create the database

Open SQL Shell and enter the data for your postgreSQL configuration (as you have installed the PostgreSQL admin on your computer)

CREATE DATABASE oboe

(or do it using pgAdmin tool).

6. Set your environment variables

Create the .env file for your environment variables for this project in server folder.

Your .env file must contain:

### DATABASE_URL="postgresql://<your user>:<your password>@localhost:5432/oboe?schema=public"
### DB_PORT=3001

7. Initiate prisma migrations and config

### npx prisma migrate dev --name init

8. Install prisma studio. Run on the VisualCode terminal:

### npx prisma studio

9. Seed your database

### npx prisma db seed

10. Start both server and client with

### npm run dev
### cd ../client
### npm run dev