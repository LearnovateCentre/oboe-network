SELECT 'CREATE DATABASE oboe'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'oboe')\gexec