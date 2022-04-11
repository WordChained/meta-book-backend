const express = require('express')
const { getNotifications, addNotification, removeNotification, setStatus } = require('./notification-controller')
const router = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)

router.get('/:id', getNotifications)
router.post('/add', addNotification)
router.delete('/remove', removeNotification)
router.put('/read', setStatus)

module.exports = router