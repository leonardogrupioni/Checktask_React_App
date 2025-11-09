// Compatível com APIs nova e antiga do expo-sqlite
let SQLite;
try {
  SQLite = require('expo-sqlite');
} catch (_) {
  throw new Error('expo-sqlite não está instalado. Rode: npx expo install expo-sqlite');
}

let _dbLegacy = null;
let _dbAsyncPromise = null;

// Detecta automaticamente qual API está disponível
const hasLegacy = typeof SQLite.openDatabase === 'function';
const hasAsync =
  typeof SQLite.openDatabaseAsync === 'function'; // SDKs novos (Expo 51+)

function getLegacyDB() {
  if (!_dbLegacy) _dbLegacy = SQLite.openDatabase('checktask.db');
  return _dbLegacy;
}

async function getAsyncDB() {
  if (!_dbAsyncPromise) {
    _dbAsyncPromise = SQLite.openDatabaseAsync('checktask.db');
  }
  return _dbAsyncPromise;
}

/** Executa SQL (retorna resultado) */
export async function exec(sql, params = []) {
  if (hasAsync) {
    const db = await getAsyncDB();
    // runAsync retorna um objeto { changes, lastInsertRowId } em UPDATE/INSERT/DELETE
    return db.runAsync(sql, params);
  }

  if (hasLegacy) {
    const db = getLegacyDB();
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          sql,
          params,
          (_tx, res) => resolve(res),
          (_tx, err) => {
            reject(err);
            return true;
          }
        );
      });
    });
  }

  throw new Error('Nenhuma API suportada do expo-sqlite foi encontrada.');
}

/** Retorna lista de linhas */
export async function getAll(sql, params = []) {
  if (hasAsync) {
    const db = await getAsyncDB();
    return db.getAllAsync(sql, params); // retorna array de objetos
  }

  if (hasLegacy) {
    const res = await exec(sql, params);
    const list = [];
    for (let i = 0; i < res.rows.length; i++) list.push(res.rows.item(i));
    return list;
  }

  return [];
}

/** Retorna primeira linha ou null */
export async function getOne(sql, params = []) {
  if (hasAsync) {
    const db = await getAsyncDB();
    return db.getFirstAsync(sql, params); // objeto ou undefined
  }

  if (hasLegacy) {
    const res = await exec(sql, params);
    if (!res.rows || res.rows.length === 0) return null;
    return res.rows.item(0);
  }

  return null;
}

/** Cria/garante o schema */
export async function ensureSchema() {
  await exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      phone TEXT,
      password_hash TEXT NOT NULL,
      created_at INTEGER NOT NULL
    );
  `);

  await exec(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL,
      time TEXT,
      activity TEXT NOT NULL,
      color TEXT,
      completed INTEGER NOT NULL DEFAULT 0,
      user_id INTEGER,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
  `);
}

// Zera o banco: DROP em todas as tabelas e recria o schema
export async function resetSchema() {
  // apaga tabelas (se não existirem, ignora)
  await exec(`DROP TABLE IF EXISTS tasks;`);
  await exec(`DROP TABLE IF EXISTS users;`);
  try { await exec(`VACUUM;`); } catch (_) {}
  // recria tudo
  await ensureSchema();
}