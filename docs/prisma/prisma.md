# PRISMA

- [PRISMA](#prisma)
  - [Getting started](#getting-started)
  - [Prisma schema](#prisma-schema)
  - [Enums](#enums)
  - [Models](#models)
  - [Field types](#field-types)
  - [Field modifiers](#field-modifiers)
  - [Attributes](#attributes)
    - [Field attributes](#field-attributes)
    - [Block atributtes](#block-atributtes)
  - [Relation fields](#relation-fields)
    - [One-to-many relation](#one-to-many-relation)
  - [Many-to-many relation](#many-to-many-relation)
    - [Implicit many-to-many relation](#implicit-many-to-many-relation)
    - [Explicit many-to-many relation](#explicit-many-to-many-relation)
  - [One-to-one relation](#one-to-one-relation)
  - [Atribute functions](#atribute-functions)
  - [Prisma Client](#prisma-client)
      - [Create](#create)
      - [Read](#read)
  - [Advanced filtering](#advanced-filtering)
    - [Combining operators](#combining-operators)
    - [Filtering on relations](#filtering-on-relations)
    - [Update](#update)
    - [Connect Existing Relationships](#connect-existing-relationships)
  - [Delete](#delete)
    - [Pagination](#pagination)
    - [Aggregation, grouping and summarizing](#aggregation-grouping-and-summarizing)
    - [Transactions and batch queries](#transactions-and-batch-queries)
    - [Raw database access](#raw-database-access)
  - [upsert](#upsert)

## Getting started

- yarn add prisma -D : for javascript projects
- (no)yarn add prisma typescript ts-node @types/node -D : for installing prisma and typescript 
- npx tsc --init : for creating a tsconfig.json file
- (no) npx prisma: invoke Prisma CLI
- npx prisma init : for creating a prisma folder with a schema.prisma file
- npx prisma init --datasource-provider postgresql : we can also specify the database provider
- npx prisma migrate dev --name init : for creating a migration file
- yarn add @prisma/client : for installing the Prisma Client 
- npx prisma generate : for generating Prisma Client, the install command automatically invokes this command. But whenever you make changes to the schema.prisma file, you need to manually run this command to update the Prisma Client.
- npx prisma studio : for opening Prisma Studio
- npx prisma db seed: for seeding the database

## Prisma schema

- datasource: specifies the database provider and connection details
- generator: specifies the Prisma Client generator
- model: specifies the database schema
- enum: specifies the enum type

## Enums

```prisma

enum Role {
  USER
  ADMIN
}

model User {
  id Int @id
  name String
  role Role @default(USER)
}

```

## Models

Each model represents a database table. The model name is the table name and the model fields are the table columns.

## Field types

- Int: 32-bit integer
- BigInt: 64-bit integer
- Float: double precision floating point value
- Decimal: arbitrary precision floating point value
- String: UTF-8 encoded string
- Boolean: true or false
- DateTime: ISO-8601 compliant date time
- Object
- Json: JSON value
- Bytes: byte array
- Unsupported: it allows you to store unsupported types in the database

## Field modifiers

- ? : makes the field optional
  
  ```prisma
  model User {
    id Int @id
    name String?
  }
  ```

- [] : makes the field an array

```prisma
model User {
  id Int @id
  favoriteColors String[]
}
```

`! Can't not be optional (for example Post[]?)`

## Attributes

### Field attributes

- @id: specifies a primary key
- @default: specifies a default value
  
  ```prisma
  model User {
    id Int @id @default(autoincrement())

  }
  ```
- @unique: specifies a unique constraint
- @createdAt: specifies a timestamp for the creation (Compatible with DateTime)
- @updatedAt: specifies a timestamp for the last update(Compatible with DateTime)
  
```prisma
model User {
  id Int @id
  name String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

- @map: specifies a custom database column name
- @relation: specifies a relation between two models
- @db: specifies a custom database type

```prisma
model Product {
  id      String   @id @default(auto()) @map("_id") @db.ObjectId
  desc   String  @db.VarChar(200)

}
```

### Block atributtes

The block attribute is used to group fields together.

```prisma
model User {
  id Int @id
  name String
  age Int
  email String
  posts Post[]

  @@unique([name, age]) // we can't have two users with the same name and age
  @@index([email, ]) // @@index is used to create an index, this is useful for searching
}

model Post {
  title String
  content String
  published Boolean @default(false)

  // Not a good way to create a primary key
  @@id([title, content]) // @@id is used to create a composite primary key
}
```

Prisma model naming conventions (singular form, PascalCase)  do not always match table names in the database. A common approach for naming tables/collections in databases is to use plural form and snake_case notation - for example: comments. When you introspect a database with a table named comments, the result Prisma model will look like this:

```prisma
model comments {
  // Fields
}
```

However, you can still adhere to the naming convention without renaming the underlying comments table in the database by using the @@map  attribute:

```prisma
model Comment {
  // Fields
  @@map("comments")
}
```

In MongoDB, the primary key is called _id. You can use the @map attribute to map the id field to _id:

```prisma
model User {
  id      String   @id @map("_id")
}
```

## Relation fields

### One-to-many relation

```prisma
model Post {
  id       String       @id @default(uuid())
  // Relation field
  posts Post[] // A user can have many posts
}

model Post {
  id       String       @id @default(uuid())
  // Relation field
  User User @relation(fields: [userId], references: [id]) // A post can have one user
  userId   String
}
```

What happens if a User can have two references to the same table (Post)?
We need to add a label to the relation field.

```prisma

model User {
  id       String       @id @default(uuid())
  writtenPosts Post[] @relation("WrittenPosts")
  favoritePosts Post[] @relation("FavoritePosts")
}

model Post {
  id       String       @id @default(uuid())
  User User @relation("WrittenPosts", fields: [userId], references: [id]) 
  userId   String
  favoritedBy User? @relation("FovoritePosts", fields: [favoritedById], references: [id]) 
  favoritedById   String?
}
```

## Many-to-many relation

### Implicit many-to-many relation

```prisma

model Post {
  id       String       @id @default(uuid())
  categories Category[] // A post can have many categories
}

model Category { 
  id       String       @id @default(uuid())
  name     String
  posts    Post[]       // A category can have many posts
}
```

It automatically creates a join table called PostCategory with two foreign keys: postId and categoryId.

### Explicit many-to-many relation

Explicit relations mostly need to be created in cases where you need to store extra fields in the relation table or if you're introspecting an existing database that already has many-to-many relations setup. This is the same schema used above but with an explicit relation table:

```prisma
model Post {
  id       String       @id @default(uuid())
  categories PostCategory[] // A post can have many categories
}

model Category { 
  id       String       @id @default(uuid())
  name     String
  posts    Post[]       // A category can have many posts
}

model PostCategory {
  postId String
  categoryId String
  post Post @relation(fields: [postId], references: [id])
  category Category @relation(fields: [categoryId], references: [id])
  @@id([postId, categoryId])
}
```

## One-to-one relation

```prisma
model User {
  id       String       @id @default(uuid())
  profile  Profile?     // A user can have one profile
}

model Profile {
  id       String       @id @default(uuid())
  user     User         @relation(fields: [userId], references: [id]) // A profile can have one user
  userId   String
}
```

## Atribute functions

- autoincrement(): generates a unique integer for each new record

## Prisma Client

### CRUD operations

#### Create

```prisma
const user = await prisma.user.create({
  data: {
    name: 'Alice',
    email: 'alice@gmail.com',
    age: 30,
  },
})
```

With Prisma we can do nested writes in the models that have a relation, all in one create call.

```prisma
const user = await prisma.user.create({
  data: {
    name: 'Alice',
    email: 'alice@gmail.com',
    age: 30,
    posts: {
      create: { title: 'Hello World' }, // we can create a post for the user
    },
  },
})
```

If we want to retrieve the nested data we can use the include option.

```prisma
const user = await prisma.user.create({
  data: {
    name: 'Alice',
    email: 'alice@gmail.com'
    age: 30,
    posts: {
      create: { title: 'Hello World' },
    },
  },
  include: {
    posts: true,
  },
})

return user
```

Or we can use the select option to select the fields we want to retrieve.

```prisma
const user = await prisma.user.create({
  data: {
    name: 'Alice',
    email: 'alice@gmail.com'
    age: 30,
    posts: {
      create: { title: 'Hello World' },
    },
  },
  select: {
    name: true,
    email: true,
    posts: {
      select: {
        title: true,
      },
    },
  },
})

return user
```

IMPORTANT: But we can only use one of them at a time.

In onder to know whats happening under the hood we can log the query.

```prisma
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient({ log: ['query'] })

const user = await prisma.user.create({
  data: {
    name: 'Alice',
    email: 'alice@gmail.com'
    age: 30,
    posts: {
      create: { title: 'Hello World' },
    },
  },
  select: {
    name: true,
    email: true,
    posts: {
      select: {
        title: true,
      },
    },
  },
})
```

We can also create multiple records at once.
IMPORTANT: Inside of a createMany call, you can't use nested writes (create, connect, update, upsert, delete) or include or select.

```prisma
const users = await prisma.user.createMany({
  data: [
    {
      name: 'Alice',
      email: 'alice@gmail.com',
      age: 30,
      posts: {
        create: { title: 'Hello World' },
      },
    },
    {
      name: 'Bob',
      email: 'bob@gmail.com',
      age: 35,
      posts: {
        create: { title: 'Hello World' },
      },
    },
  ],
})
```

#### Read

findUnique: returns a single record that matches the condition specified by where.

```prisma
const user = await prisma.user.findUnique({
  where: {
    email: 'alice@gmail.com',
  },
})
```

IMPORTANT: Nested Reads  
We can pass select or include exactly the same way we did in the create call.
You can also nest select inside of include and vice versa but you can't use both at the same time.

findFirst: returns the first record that matches the condition specified by where. It doesn't have to be an unique field.

findMany: returns all records that match the condition specified by where.

```prisma
const users = await prisma.user.findMany({
  where: {
    name: 'Alice',
  },
})
```

We can modify the query with the following options:

- distinct: returns all records that have a distinct value for the specified field.

```prisma
const users = await prisma.user.findMany({
  where: {
    name: 'Alice',
  },
  distinct: ['email'],
})
```

- take: returns the first n records.

```prisma
const users = await prisma.user.findMany({
  where: {
    name: 'Alice',
  },
  take: 10,
})
```

- skip: skips the first n records.

```prisma
const users = await prisma.user.findMany({
  where: {
    name: 'Alice',
  },
  take: 10,
  skip: 1,
})
```

- orderBy: orders the records by the specified field.

```prisma
const users = await prisma.user.findMany({
  where: {
    name: 'Alice',
  },
  orderBy: {
    age: 'asc',
  },
})
```

## Advanced filtering

- not: negates the condition.

```prisma
const users = await prisma.user.findMany({
  where: {
    name: { not: 'Alice' },
  },
})
```

- in: checks if the value is in the specified list.

```prisma
const users = await prisma.user.findMany({
  where: {
    name: { in: ['Alice', 'Bob'] },
  },
})
```

- notIn: checks if the value is not in the specified list.

```prisma
const users = await prisma.user.findMany({
  where: {
    name: { notIn: ['Alice', 'Bob'] },
  },
})
```

- lt: checks if the value is less than the specified value.

```prisma
const users = await prisma.user.findMany({
  where: {
    age: { lt: 30 },
  },
})
```

- lte: checks if the value is less than or equal to the specified value.
- gt: checks if the value is greater than the specified value.
- gte: checks if the value is greater than or equal to the specified value.
- contains: checks if the value contains the specified string.

```prisma
const users = await prisma.user.findMany({
  where: {
    email: { contains: '@learnovate.net' },
  },
})
```

- endsWith: checks if the value ends with the specified string.
- startsWith: checks if the value starts with the specified string.

### Combining operators

We can combine operators using AND and OR.

- AND: combines two or more conditions, all of which must be true. It's the default operator so you only need to specify it when you have more than one condition for the same field.

```prisma
const users = await prisma.user.findMany({
  where: {
    AND: [
      {
        email: {startsWith: 'alice'},
      },
      {
        email: { contains: '@learnovate.net' },
      },
    ],
  },
})
```

- OR: combines two or more conditions, at least one of which must be true.
- NOT: negates the condition.

### Filtering on relations

```prisma
const users = await prisma.user.findMany({
  where: {
    posts: {
      title: { contains: 'Hello' },
    },
  },
})
```

- some: checks if at least one record matches the condition.
We want to make a query that returns all users that have at least one post with the title Hello World, we can use some:

```prisma
const users = await prisma.user.findMany({
  where: {
    posts: {
      some: {
        title: { contains: 'Hello' },
      },
    },
  },
})
```

- every: checks if all records match the condition.
We want to return all users that have all posts with the title Hello World:

```prisma
const users = await prisma.user.findMany({
  where: {
    posts: {
      every: {
        title: { contains: 'Hello' },
      },
    },
  },
})
```

- none: checks if none of the records match the condition.
We want to return all users that don't have any posts with the title Hello World:

```prisma
const users = await prisma.user.findMany({
  where: {
    posts: {
      none: {
        title: { contains: 'Hello' },
      },
    },
  },
})
```

### Update

IMPORTANT: When you update a record, the where clause must be unique. If you try to update a record without specifying a unique field, you'll get an error.
- update: updates a record.

```prisma
const updatedUser = await prisma.user.update({
  where: {
    id: 19,
  },
  data: {
    name: 'Bob',
  },
})
```

- increment: increments a numeric field by the specified value.
- decrement: decrements a numeric field by the specified value.
- multiply: multiplies a numeric field by the specified value.
- divide: divides a numeric field by the specified value.

- updateMany: updates multiple records.
IMPORTANT: you can't use include or select with updateMany.

- upsert: updates a record if it exists, otherwise creates a new record.

### Connect Existing Relationships

What happens if we want to connect an existing relationship? For example, we want to connect a post to an existing user. We can use connect:

```prisma
const updatedPost = await prisma.user.update({
  where: {
    id: 19,
  },
  data: {
    posts: {
      connect: {
        id: 1, // The id of the post that already exists, intead of creating a new one
      },
    },
  },
})
```

## Delete

IMPORTANT: When you delete a record, the where clause must be unique. If you try to update a record without specifying a unique field, you'll get an error.

```prisma
const deletedUser = await prisma.user.delete({
  where: {
    id: 19,
  },
})
```

### Pagination

### Aggregation, grouping and summarizing

### Transactions and batch queries

### Raw database access

You cannot use select and include on the same level. This means that if you choose to include a user's post and select each post's title, you cannot select only the users' email

```prisma
// The following query returns an exception
const getUser = await prisma.user.findUnique({
  where: {
    id: 19,
  },
|  select: { // This won't work!
    email:  true
  }
|  include: { // This won't work!
    posts: {
      select: {
        title: true
      }
    }
  },
})
```

Instead, use nested select options:

```prisma
const getUser = await prisma.user.findUnique({
  where: {
    id: 19,
  },
  select: {
    email: true,
    posts: {
      select: {
        title: true,
      },
    },
  },
})
```

## upsert

upsert does the following:

If an existing database record satisfies the where condition, it updates that record
If no database record satisfies the where condition, it creates a new database record