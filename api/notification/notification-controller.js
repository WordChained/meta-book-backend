
const notificationService = require('./notification-service')
const logger = require('../../services/logger-service')




async function getNotifications(req, res) {
    try {
        const notifications = await notificationService.getNotifications(req.params.id)
        res.send(notifications)
    } catch (error) {
        logger.error('getNotifications error.', error)
    }

}
async function addNotification(req, res) {
    const { notification } = req.body
    console.log('notification in addNotification controller:', notification);
    try {
        const newNotification = await notificationService.addNotification(notification)
        res.send(newNotification)
    } catch (error) {
        logger.error('addNotification error.', error)
    }

}
async function removeNotification(req, res) {
    const { notificationId } = req.body
    try {
        await notificationService.removeNotification(notificationId)
        res.send({ message: 'notification removed!' })
    } catch (error) {
        logger.error('notification removeNotification error.', error)
    }

}

async function setStatus(req, res) {
    const { ids } = req.body
    try {
        await notificationService.setRead(ids)
        res.send({ message: 'notifications read!' })
    } catch (error) {
        logger.error('notification setStatus error.', error)
    }

}

module.exports = {
    getNotifications,
    addNotification,
    removeNotification,
    setStatus
}