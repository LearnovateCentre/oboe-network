#!sh

npx prisma generate
npx prisma migrate deploy --name init
npx prisma db seed

npm start
