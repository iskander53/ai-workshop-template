// Two drivers so local dev needs no DB install (SQLite) while Render uses Postgres.

const databaseUrl = process.env.DATABASE_URL || "";
const isPostgres = databaseUrl.startsWith("postgres://") || databaseUrl.startsWith("postgresql://");

let _query;
export let dbKind;

if (isPostgres) {
  const { default: pg } = await import("pg");
  const pool = new pg.Pool({
    connectionString: databaseUrl,
    ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : undefined,
  });

  _query = async (sql, params = []) => {
    let i = 0;
    const pgSql = sql.replace(/\?/g, () => `$${++i}`);
    const result = await pool.query(pgSql, params);
    return result.rows;
  };
  dbKind = "postgres";
} else {
  const { default: Database } = await import("better-sqlite3");
  const path = process.env.SQLITE_PATH || "./data.sqlite";
  const db = new Database(path);

  _query = async (sql, params = []) => {
    const stmt = db.prepare(sql);
    if (stmt.reader) {
      return stmt.all(...params);
    }
    const info = stmt.run(...params);
    return [{ changes: info.changes, lastInsertRowid: info.lastInsertRowid }];
  };
  dbKind = "sqlite";
}

export const query = _query;
