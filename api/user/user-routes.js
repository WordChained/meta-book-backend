const express = require('express')
const { requireAuth } = require('../../middlewares/requireAuth.middleware')
const { getUser, getUsers, updateUser, deleteUser } = require('./user-controller')
const router = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)

router.get('/search/:filter', getUsers,
    // requireAuth
)
// router.post('/', getUsersById,
//     // requireAuth
// )
router.get('/:id', getUser,
    // requireAuth
)
router.put('/update', updateUser,
    // requireAuth
)
router.delete('/remove', deleteUser,
    // requireAuth
)

module.exports = router