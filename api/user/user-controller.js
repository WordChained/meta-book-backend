const userService = require('./user-service')
// const socketService = require('../../services/socket-service')
const logger = require('../../services/logger-service')


async function getUsers(req, res) {
  const { filter } = req.params
  try {
    const users = await userService.getUsers(filter)
    res.send(users)
  } catch (err) {
    logger.error('Failed to get users', err)
    res.status(500).send({ err: 'Failed to get users' })
  }
}

async function getUser(req, res) {
  try {
    const user = await userService.getUserById(req.params.id)
    res.send(user)
  } catch (err) {
    logger.error('Failed to get user', err)
    res.status(500).send({ err: 'Failed to get user' })
  }
}
// async function getUsersById(req, res) {
//   try {
//     const user = await userService.getUsersById(req.params.id)
//     res.send(user)
//   } catch (err) {
//     logger.error('Failed to get user', err)
//     res.status(500).send({ err: 'Failed to get user' })
//   }
// }

async function deleteUser(req, res) {
  try {
    await userService.remove(req.params.id)
    res.send({ msg: 'Deleted successfully' })
  } catch (err) {
    logger.error('Failed to delete user', err)
    res.status(500).send({ err: 'Failed to delete user' })
  }
}

async function updateUser(req, res) {
  const { userId, colName, newValue } = req.body
  try {
    await userService.update(userId, colName, newValue)
    const savedUser = await userService.getUserById(userId)
    res.send(savedUser)
    // socketService.broadcast({ type: 'user-updated', to: savedUser._id })
  } catch (err) {
    logger.error('Failed to update user', err)
    res.status(500).send({ err: 'Failed to update user' })
  }
}

module.exports = {
  getUsers,
  getUser,
  deleteUser,
  updateUser,
  // getUsersById
}