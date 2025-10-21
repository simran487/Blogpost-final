import pg from 'pg';
import fs from 'fs';
import path from 'path';
import 'dotenv/config';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbConfig = {
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
};
const dbName = process.env.PGDATABASE;

export const ensureDatabaseInitialized = async () => {
  // Connect to the default 'postgres' database to check for the existence of our db
  const client = new pg.Client({ ...dbConfig, database: 'postgres' });

  try {
    // 1. Connect to the default 'postgres' database to check/create our application DB.
    await client.connect();
    console.log('Connected to PostgreSQL server to check for database existence.');

    const checkDbQuery = `SELECT 1 FROM pg_database WHERE datname = '${dbName}'`;
    const { rows } = await client.query(checkDbQuery);

    // 2. Create the database if it does not exist.
    if (rows.length === 0) {
      console.log(`Database '${dbName}' does not exist. Creating it...`);
      await client.query(`CREATE DATABASE "${dbName}"`);
      console.log(`Database '${dbName}' created successfully.`);
      // --- START CHANGE: Initialize tables only when the DB is new ---
      await client.end(); // End connection to 'postgres' db before connecting to the new one

      const appDbClient = new pg.Client({ ...dbConfig, database: dbName });
      try {
        await appDbClient.connect();
        console.log(`Connected to new database '${dbName}' to initialize tables.`);

        const initDbSqlPath = path.resolve(__dirname, 'init_db.sql');
        if (fs.existsSync(initDbSqlPath)) {
          const initDbSql = fs.readFileSync(initDbSqlPath, 'utf8');
          await appDbClient.query(initDbSql);
          console.log('Tables initialized successfully from init_db.sql.');
        } else {
          throw new Error('CRITICAL: init_db.sql not found. Cannot initialize tables.');
        }
      } finally {
        await appDbClient.end();
      }
      // --- END CHANGE ---
     } else {
      console.log(`Database '${dbName}' already exists. Checking for tables...`);
      const appDbClient = new pg.Client({ ...dbConfig, database: dbName });
      try {
        await appDbClient.connect();
        const checkTablesQuery = `SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'users'`;
        const { rows: tableRows } = await appDbClient.query(checkTablesQuery);

        if (tableRows.length === 0) {
          console.log('Tables not found. Initializing tables...');
          const initDbSqlPath = path.resolve(__dirname, 'init_db.sql');
          if (fs.existsSync(initDbSqlPath)) {
            const initDbSql = fs.readFileSync(initDbSqlPath, 'utf8');
            await appDbClient.query(initDbSql);
            console.log('Tables initialized successfully from init_db.sql.');
          } else {
            throw new Error('CRITICAL: init_db.sql not found. Cannot initialize tables.');
          }
        } else {
          console.log('Tables already exist. Skipping table initialization.');
        }
      } finally {
        await appDbClient.end();
      }
    }
  } catch (error) {
    console.error('Error checking or creating database:', error);
    process.exit(1);
  } finally {
    if (client.connection) await client.end();
  }
};