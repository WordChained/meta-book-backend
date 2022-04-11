const mariadb = require('mariadb');
const { dbPassword } = require('../secrets')
const pool = mariadb.createPool({
    host: 'localhost',
    user: 'root',
    password: dbPassword,
    connectionLimit: 100,
    database: 'metabook_db',
    multipleStatements: true
});
async function getPool() {
    try {
        const conn = await pool.getConnection();
        return conn
    } catch (err) {
        console.log('getPool error:', err);
        // console.log('activeConnections:', pool.activeConnections());
        throw err;
    }
}


module.exports = {
    getPool,
    // asyncFunction
}
