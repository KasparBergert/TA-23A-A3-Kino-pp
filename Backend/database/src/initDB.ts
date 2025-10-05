import mariadb from 'mariadb'
import fs from 'fs'
import path from 'path'

const conn = await mariadb.createConnection({
  port: 3306,
  user: 'root',
  password: `${process.env.DBrootpass}`,
  database: 'movies',
  multipleStatements: true,
})

/**
 * @param conn - root level connection to the database
 * Purpose: when setting it up on a new computer, i can just run the db normally.
 */
export default async function initDB() {
  /*
    in the future:
    create genres
    // should add the database schema here to to the initialization.
  */
  const [row] = await conn.query('SELECT CURRENT_USER() AS user')
  if (row.user != 'root@localhost') {
    throw Error('Cannot initialize DB because Given connection is not root@localhost')
  }

  try {
    await conn.query('SELECT 1; SELECT 2;')
  } catch (err) {
    throw Error("Cannot Initialize DB because 'multipleStatements' is false for current connetion")
  }

  //Database schema
  const dbSchema = fs.readFileSync(path.resolve('./Backend/database/src/database_schema.sql'), {
    encoding: 'utf-8',
  })

  //create 'dev'@'localhost' user
  await conn.query("CREATE USER IF NOT EXISTS 'dev'@'localhost' IDENTIFIED BY ?", [
    process.env.DBdevpass,
  ])

  await conn.query("GRANT SELECT, UPDATE, DELETE, INSERT ON movies.* TO 'dev'@'localhost'")

  await conn.query(dbSchema)
  await conn.query("INSERT IGNORE INTO roles (code) VALUES ('user')")
  await conn.query("INSERT IGNORE INTO roles (code) VALUES ('admin')")
}
