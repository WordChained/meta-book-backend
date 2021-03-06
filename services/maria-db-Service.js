const mariadb = require('mariadb');
// const { dbPassword } = require('../secrets')
//metabook_db
const pool = mariadb.createPool({
    host: 'metabook.csx5zg5uetwq.eu-west-1.rds.amazonaws.com',
    user: 'wordchained',
    password: process.env.dbPassword,
    connectionLimit: 20,
    database: 'metabook_db',
    multipleStatements: true
});
async function getPool() {
    let conn;
    try {
        conn = await pool.getConnection();
        return conn
    } catch (err) {
        console.log('getPool error:', err);
        // console.log('activeConnections:', pool.activeConnections());
        if (conn) conn.end()
        throw err;
    }
}


module.exports = {
    getPool,
    // asyncFunction
}
