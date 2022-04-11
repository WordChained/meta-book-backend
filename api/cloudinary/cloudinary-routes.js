const express = require('express')
const { getMedia, removeMedia, addMedia } = require('./cloudinary-controller')
const router = express.Router()


router.get('/:id', getMedia)
router.post('/', addMedia)
router.delete('/remove-media', removeMedia)

module.exports = router