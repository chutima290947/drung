require('dotenv').config()
const { Pool } = require('pg')

const url = process.env.DATABASE_URL || ''
const local = /localhost|127\.0\.0\.1/.test(url)
const pool = new Pool({ connectionString: url, ssl: local ? false : { rejectUnauthorized: false } })
pool.on('error', (e) => console.error('PostgreSQL error', e))
module.exports = pool
