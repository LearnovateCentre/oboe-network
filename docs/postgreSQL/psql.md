# PSQL

\? - help
\l - list databases
CREATE DATABASE <name> - create database
\c <name> - connect to database
CREATE TABLE <name> (id INT, name VARCHAR(100), on_sale BOOLEAN); - create table
\d - list tables
Postgres psql needs escaping for capital letters in table names
\d+ "<name>" - describe table
ALTER TABLE <name> ADD COLUMN <column_name> <data_type>; - add column
DROP TABLE <name> - delete table
INSERT INTO <name> (id, name, on_sale) VALUES (1, 'T-shirt', true); - insert row
SELECT * FROM <name>; - select all rows
SELECT * FROM <name> WHERE <column_name> = <value>; - select rows with condition
UPDATE <name> SET <column_name> = <value> WHERE <column_name> = <value>; - update rows with condition
DELETE FROM <name> WHERE <column_name> = <value>; - delete rows with condition
\q - quit
DROP DATABASE <name> - delete database

## Open psql in terminal

```bash
psql -U <username>
```

