// const mongoDBService = require('../../services/mongo-db-service')
// const mariadb = require('mariadb');
const { getPool } = require('../../services/maria-db-Service')

const logger = require('../../services/logger-service')
// const bcrypt = require('bcrypt');
const { getUserById } = require('../user/user-service');
const ObjectId = require('mongodb').ObjectId

module.exports = {
    queryFriends,
    sendFriendRequest,
    approveFriendRequest,
    denyFriendRequest,
    removeFriend
}

async function queryFriends(userId) {
    const conn = await getPool()
    console.log('userId in queryFriends:', userId);
    try {
        const friendsIds = await conn.query(
            `SELECT friend_id, status FROM friends WHERE user_id LIKE "%${userId}%" AND status ='f' OR status = 'p'`
        )
        const friends = await Promise.all(friendsIds.map(async fId => {
            const friend = await conn.query(`SELECT userId, name, profilePicture FROM users WHERE userId = '${fId.friend_id}'`)
            friend[0].name = JSON.parse(friend[0].name)
            friend[0].status = fId.status
            return friend[0]
        }))
        console.log('friends:', friends);
        return friends
    } catch (err) {
        logger.error('error while finding friends', err)
        // throw err
    }
    if (conn) return conn.end()
}
async function sendFriendRequest(userId, friendId) {
    const conn = await getPool()
    // ('user_id,friend_id,since,status)
    //status options:
    //p - pending friend request
    //f - friends
    try {
        await conn.batch(
            `INSERT friends VALUES(?,?,?,?,?)`, [[userId, friendId, Date.now().toString(), "p", userId], [friendId, userId, Date.now().toString(), "p", userId]]
        )
        const friend = await getUserById(friendId)
        friend.status = "p"
        return friend
    } catch (err) {
        logger.error('cannot send friend request', err)
        // throw err
    }
    if (conn) return conn.end()
}
async function approveFriendRequest(userId, friendId) {
    const conn = await getPool()
    try {
        await conn.query(
            `UPDATE friends SET status = 'f' WHERE user_id ='${userId}' OR user_id ='${friendId}'`
        )
        return await getUserById(friendId)
    } catch (err) {
        logger.error('cannot approve friend request', err)
    }
    if (conn) return conn.end()
}
async function denyFriendRequest(userId, friendId) {
    const conn = await getPool()
    try {
        await conn.query(
            // `DELETE FROM friends WHERE user_id ='${userId}' AND friend_id ='${friendId}'`,
            `DELETE FROM friends WHERE friend_id ='${userId}' AND user_id = '${friendId}'`
        )
        return
    } catch (err) {
        logger.error('cannot apprive friend request', err)
        // throw err
    }
    if (conn) return conn.end()
}
async function removeFriend(userId, friendId) {
    const conn = await getPool()
    try {
        await conn.query(
            `DELETE FROM friends WHERE user_id ='${userId}' AND friend_id ='${friendId}'; DELETE FROM friends WHERE friend_id ='${userId}' AND user_id = '${friendId}'`,
        )
        return
    } catch (err) {
        logger.error('cannot remove friend', err)
    }
    if (conn) return conn.end()
}
