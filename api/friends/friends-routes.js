const express = require('express')
const { requireAuth } = require('../../middlewares/requireAuth.middleware')
const { getFriends, addFriend, removeFriend } = require('./friends-controller')
const router = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)

router.get('/:id', getFriends)
router.post('/add', addFriend)
router.delete('/', removeFriend)

module.exports = router