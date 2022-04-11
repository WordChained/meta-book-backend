
const friendsService = require('./friends-service')
const logger = require('../../services/logger-service')




async function getFriends(req, res) {
    try {
        const friends = await friendsService.queryFriends(req.params.id)
        res.send(friends)
    } catch (error) {
        logger.error('getFriends error.', error)
    }

}
async function addFriend(req, res) {
    const { userId, friendId, status } = req.body
    try {
        let addedFriend;
        switch (status) {
            case "request":
                addedFriend = await friendsService.sendFriendRequest(userId, friendId)
                res.send(addedFriend)
                break
            case "approve":
                addedFriend = await friendsService.approveFriendRequest(userId, friendId)
                res.send(addedFriend)
                break
            case "deny":
                //wont use - later will delete
                //can just remove friend
                await friendsService.denyFriendRequest(userId, friendId)
                res.send({ message: 'Friend Request Denied!' })
        }
    } catch (error) {
        logger.error('addFriend error.', error)
    }

}
async function removeFriend(req, res) {
    const { userId, friendId } = req.body
    try {
        await friendsService.removeFriend(userId, friendId)
        res.send({ message: 'friend removed!' })
    } catch (error) {
        logger.error('getFriends error.', error)
    }

}
module.exports = {
    getFriends, addFriend, removeFriend
}