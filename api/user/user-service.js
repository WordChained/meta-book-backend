// const mongoDBService = require('../../services/mongo-db-service')
const mariadb = require('mariadb');
const logger = require('../../services/logger-service')
// const reviewService = require('../review/review-service')
const { getPool } = require('../../services/maria-db-Service')
const { ObjectId } = require('mongodb');

const bcrypt = require('bcrypt')

const _furtherFilter = (users, filter) => {
    const filteredUsers = users.filter((user) => {
        const fullString = `${user.name.first} ${user.name.middle} ${user.name.last}`
        return fullString.includes(filter)
    })
    return filteredUsers
}
module.exports = {
    getUserById,
    signup,
    remove,
    update,
    query,
    getUserByEmail,
    getUsers

}


async function query() {
    const conn = await getPool()
    try {
        const users = await conn.query('SELECT * FROM users')
        return users
    } catch (error) {
        console.log(error.text);
    }

    if (conn) return conn.end()
}
async function getUserById(userId) {
    const conn = await getPool()
    try {
        const user = await conn.query(`SELECT * FROM users WHERE userId = '${userId}'`)
        delete user[0].password
        const parsedUser = { ...user[0], name: JSON.parse(user[0].name), DOB: JSON.parse(user[0].DOB), address: JSON.parse(user[0].address) }
        return parsedUser
    } catch (error) {
        console.log('getUserById error:', error);
    }
    if (conn) return conn.end()

}
//mutiple users!
// async function getUsersById(idArray) {
//     const conn = await getPool()
//     try {
//         const matchingUsers = await conn.query(idArray.forEeach(id => `SELECT userId, profilePicture, name FROM users WHERE userId = '${id}'`))
//         console.log('matchingUsers:', matchingUsers);
//         const parsedUsers = matchingUsers.map(user => {
//             return { ...user, name: JSON.parse(user[0].name), DOB: JSON.parse(user[0].DOB), address: JSON.parse(user[0].address) }
//         }
//         )
//         console.log('parsedUsers:', parsedUsers);
//         return parsedUsers
//     } catch (error) {
//         console.log('getUserById error:', error);
//     }
//     if (conn) return conn.end()
// }
async function getUserByEmail(email) {
    const conn = await getPool()
    try {
        console.log('EMAIL:', email);
        const user = await conn.query(`SELECT * FROM users WHERE email = '${email}'`)
        // delete user[0].password
        console.log(user[0].userId);
        const parsedUser = { ...user[0], name: JSON.parse(user[0].name), DOB: JSON.parse(user[0].DOB), address: JSON.parse(user[0].address) }
        console.log(parsedUser);
        return parsedUser
    } catch (error) {
        // console.log('getUserByEmail error:', error);
        logger.error('getUserByEmail error:', error)
    }
    if (conn) return conn.end()

}
async function getUsers(filter) {
    if (!filter.length) return
    const conn = await getPool()
    try {
        const users = await conn.query(
            `SELECT userId, name, address, profilePicture, educationInfo, careerInfo, sex FROM users WHERE name LIKE "%${filter}%" `
        )
        const parsedUsers = users.map((user) => {
            console.log('userId:', user.userId);
            return { ...user, name: JSON.parse(user.name), address: JSON.parse(user.address) }
        })
        const fullyFilteredUsers = _furtherFilter(parsedUsers, filter.toLowerCase())
        return fullyFilteredUsers
    } catch (error) {
        // console.log('getUserByEmail error:', error);
        logger.error('getUsers error:', error)
    }
    if (conn) return conn.end()

}
async function signup(userCred) {
    const {
        name, password, profilePicture, DOB, email, sex, createdAt, address, educationInfo, careerInfo
    } = userCred
    const coverPhoto = ""
    // const friends = []
    const conn = await getPool()
    const newUserId = (new ObjectId()).toString()
    try {
        await conn.query(`INSERT users VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [newUserId, name, DOB, address, profilePicture, (!educationInfo ? null : educationInfo), (!careerInfo ? null : careerInfo), email, password, sex, createdAt, coverPhoto])
    } catch (error) {
        let retryCounter = 0
        logger.error('signup error:', error)
        if (error.errno === 1062) {
            let e = new Error('This email is already registered!')
            e.status = 409
            throw e
            // } else if (error.eerno === 45028) {
            //     while (retryCounter < 5) {//timeout
            //         console.log('retrying to signup!');
            //         setTimeout(signup(JSON.stringify(name), password, profilePicture, JSON.stringify(DOB), email, sex, createdAt, JSON.stringify(address), educationInfo, careerInfo), 3000)
            //         retryCounter = retryCounter + 1
            //         console.log('timed out, try number', retryCounter);
            //     }
        }
    }
    if (conn) return conn.end()
}
async function remove(userId) {
    const conn = await getPool()
    try {
    } catch (error) {
        // console.log('getUserByEmail error:', error);
        logger.error('remove user error:', error)
    }
    if (conn) return conn.end()
}
async function update(userId, colName, newValue) {
    const conn = await getPool()
    try {
        await conn.query(`UPDATE users SET ${colName} = '${newValue}' WHERE userId ='${userId}'`)
        return
    } catch (error) {
        // console.log('getUserByEmail error:', error);
        logger.error('update user error:', error)
    }
    if (conn) return conn.end()
}

