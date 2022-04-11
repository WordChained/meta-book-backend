// const mongoDBService = require('../../services/mongo-db-service')
const { getPool } = require('../../services/maria-db-Service')

const logger = require('../../services/logger-service')
const ObjectId = require('mongodb').ObjectId

module.exports = {
    getNotifications,
    addNotification,
    setRead,
    removeNotification
}

async function getNotifications(userId) {
    const conn = await getPool()
    try {
        const notifications = await conn.query(
            `SELECT * FROM notifications WHERE user_id = '${userId}' ORDER BY date DESC`
        )
        if (!notifications) return []
        const fullNotifications = await Promise.all(notifications.map(async ntf => {
            const userInfo = await conn.query(`SELECT name, profilePicture FROM users WHERE userId = '${ntf.sender_id}'`)
            userInfo[0].name = JSON.parse(userInfo[0].name)
            ntf.user_info = userInfo[0]
            return ntf
        }))
        return fullNotifications
    } catch (err) {
        logger.error('error while finding notifications', err)
        // throw err
    }
    if (conn) return conn.end()
}
async function addNotification(notification) {
    const { user_id, sender_id, content, item_type, interaction, status, date } = notification

    const id = (new ObjectId()).toString()
    const conn = await getPool()
    try {
        await conn.query(`INSERT notifications VALUES(?, ?, ?, ?, ?, ?, ?, ?)`, [id, user_id, sender_id, date, content ? content : null, item_type, interaction, status])
        return { id, to: user_id, from: sender_id, date, content: content ? content : null, item_type, interaction, status }
    } catch (err) {
        logger.error('cannot add notification', err)
        // throw err
    }
    if (conn) return conn.end()
}
async function setRead(ids) {
    const conn = await getPool()
    try {
        await Promise.all(ids.map(async id => {
            return await conn.query(`UPDATE notifications SET status = 'read' WHERE id='${id}'`)
        }))
        return
    } catch (err) {
        logger.error('cannot change notifications status', err)
        // throw err
    }
    if (conn) return conn.end()
}
async function removeNotification(notificationId) {
    const conn = await getPool()
    try {
        await conn.query(`DELETE FROM notifications WHERE id='${notificationId}'`)
        return
    } catch (err) {
        logger.error('cannot delete notification', err)
        // throw err
    }
    if (conn) return conn.end()
}
