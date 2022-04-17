const mariadb = require('mariadb');
// const { dbPassword } = require('../secrets')
//metabook_db
const pool = mariadb.createPool({
    host: 'metabook.csx5zg5uetwq.eu-west-1.rds.amazonaws.com',
    user: 'wordchained',
    password: process.env.dbPassword,
    connectionLimit: 100,
    database: 'metabook',
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
