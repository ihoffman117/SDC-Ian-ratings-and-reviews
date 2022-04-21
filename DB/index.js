const { Pool } = require('pg')
const config = require('../config.js')

const pool = new Pool({
  host: config.host,
  user: config.user,
  password: config.password,
  database: config.database,
})

module.exports = pool