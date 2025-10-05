import mariadb, { PoolConnection } from 'mariadb'
import initDB from './initDB'

// --- INITIALIZATION ---
await initDB()
console.log('---- Database Initialized ----')

const pool = mariadb.createPool({
  host: '127.0.0.1',
  port: 3306,
  user: 'dev',
  password: `${process.env.DBdevpass}`,
  database: 'movies',
  connectionLimit: 40,
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
