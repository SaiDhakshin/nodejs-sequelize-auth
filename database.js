const Pool = require('pg').Pool;

const pool = new Pool({
    user : "postgres",
    password : "qmpzfgh4563",
    database : "authuser",
    host : "localhost",
    port : 5432
})

module.exports = pool;