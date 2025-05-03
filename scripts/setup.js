import Database from "better-sqlite3";
import fs from "fs";

const database_url = process.env.DATABASE_URL;
const schema_file = process.env.DATABASE_SCHEMA_FILE || "/app/build/init.sql";

if (!database_url) throw new Error("DATABASE_URL is not set");

console.log(`Create database schema from "${schema_file}"`);

const client = new Database(database_url);
const sqlScript = fs.readFileSync(schema_file).toString();

client.exec(sqlScript);
console.log(`Initialized "${database_url}"`);
