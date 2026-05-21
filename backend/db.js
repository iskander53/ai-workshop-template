// Dialect is picked from DATABASE_URL so the same config works locally
// (blank → SQLite file) and on Render (Postgres connection string injected).
import { Sequelize } from "sequelize";

const url = process.env.DATABASE_URL;
const isPostgres = url && (url.startsWith("postgres://") || url.startsWith("postgresql://"));

export const dbKind = isPostgres ? "postgres" : "sqlite";

export const sequelize = isPostgres
  ? new Sequelize(url, {
      dialect: "postgres",
      logging: false,
      dialectOptions:
        process.env.NODE_ENV === "production"
          ? { ssl: { require: true, rejectUnauthorized: false } }
          : {},
    })
  : new Sequelize({
      dialect: "sqlite",
      storage: process.env.SQLITE_PATH || "./data.sqlite",
      logging: false,
    });
