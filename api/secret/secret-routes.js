const express = require('express')
const { getSecret } = require('./secret-controller')
const router = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)

router.get('/', getSecret)

module.exports = router