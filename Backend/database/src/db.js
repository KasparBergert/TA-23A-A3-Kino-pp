import mariadb from 'mariadb'

const pool = mariadb.createPool({
  host: '127.0.0.1',
  port: 3306,
  user: 'dev',
  password: '01293472093',
  database: 'movies',
  connectionLimit: 1,
})

//since there is manual releasing, you have to insert a callback
/**
 * @param {Function} callback
 * @returns what the callback returns
 */
export default async function db(callback) {
  let conn = null
  try {
    conn = await pool.getConnection()
    return await callback(conn)
  } catch (err) {
    console.log('DB Error:', err)
  } finally {
    if (conn) {
      conn.release()
    }
  }
}

// --- INITIALIZATION ---
db(async (db) => {
  /*
Purpose: when setting it up on a new computer, i can just run the db like normally.

right now:
create 2 roles, admin and client

in the future:
create genres

*/

  await db.query("INSERT IGNORE INTO roles (code) VALUES ('user')")
  await db.query("INSERT IGNORE INTO roles (code) VALUES ('admin')")
  console.log('---- Database Initialized ----')
})
