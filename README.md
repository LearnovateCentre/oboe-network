# oboe-network

VisualCode tool to clone the repository to your local machine (or run the appropriate command:

git clone https://github.com/LearnovateCentre/oboe-network.git

Move to client

cd .\client\

Install dependencies and run

npm install
npm run dev -- --port 3001

Do same with server
Create the database

Open SQL Shell and enter the data for your postgreSQL configuration (as you have installed the PostgreSQL admin on your computer)

CREATE DATABASE oboe

 or do it using pgAdmin tool.

Create the .env file for your environment variables for this project in server folder.

Add DATABASE_URL variable to the env file with the Windows PowerShell

DATABASE_URL="postgresql://<your user>:<your password>@localhost:5432/oboe?schema=public"
DB_PORT=3001


Initiate prisma migrations and config


npx prisma migrate dev --name init

Install prisma studio. Run on the VisualCode terminal:


npx prisma studio

Seed your database


npx prisma db seed