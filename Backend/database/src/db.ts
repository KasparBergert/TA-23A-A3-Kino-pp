import mariadb, { Connection, PoolConnection } from 'mariadb'

const pool = mariadb.createPool({
  host: '127.0.0.1',
  port: 3306,
  user: 'dev',
  password: '01293472093',
  database: 'movies',
  connectionLimit: 3,
})

//since there is manual releasing, you have to insert a callback
/**
 * @param {Function} callback
 * @returns what the callback returns
 */
export default async function db(callback: Function) {
  let conn: PoolConnection | undefined
  try {
    conn = await pool.getConnection()
    return await callback(conn)
  } catch (err) {
    console.log('DB Error:', err)
  } finally {
    if (conn) {
      await conn.release()
    }
  }
}

// --- INITIALIZATION ---
db(async (db: Connection) => {
  /*
  Purpose: when setting it up on a new computer, i can just run the db normally.

  in the future:
  create genres

  // should add the database schema here to to the initialization.
  */

  await db.query("INSERT IGNORE INTO roles (code) VALUES ('user')")
  await db.query("INSERT IGNORE INTO roles (code) VALUES ('admin')")
  console.log('---- Database Initialized ----')
})
