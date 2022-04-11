const express = require('express')
const { requireAuth } = require('../../middlewares/requireAuth.middleware')
const { getItem, getItems, removeItem, updateItem, addItem, getUserItems } = require('./item-controller')
const router = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)

router.post('/', getItems)
router.get('/my-posts/:id', getUserItems)
router.post('/:id', getItem)
router.put('/post/:id', updateItem, requireAuth)
router.put('/comment/:id', updateItem, requireAuth)
router.post('/add/post', addItem, requireAuth)
router.post('/add/comment', addItem, requireAuth)
router.delete('/post/:id', removeItem, requireAuth)
router.delete('/comment/:id', removeItem, requireAuth)

module.exports = router