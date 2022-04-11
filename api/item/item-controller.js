
const itemService = require('./item-service')
const logger = require('../../services/logger-service')

// itemServiceFunctions:
//      queryInPosts,
//     queryInComments,
//     getById,
//     removePost,
//     removeComment,
//     updatePost,
//     updateComment,
//     addPost,
//     addComment,


async function getItems(req, res) {
    const { userId, typeOfItem } = req.body
    // try {
    if (typeOfItem === 'post') {
        try {
            const posts = await itemService.queryInPosts(userId)
            res.send(posts)
        } catch (err) {
            logger.error('(item-controller)Failed to get items from type', typeOfItem, err)
            res.status(500).send({ err: ('Failed to get items from type', typeOfItem, err) })
        }
    } else if (typeOfItem === 'comment') {
        try {
            const comments = await itemService.queryInComments()
            res.send(comments)
        } catch (error) {
            logger.error('(item-controller)Failed to get items from type', typeOfItem, err)
            res.status(500).send({ err: ('Failed to get items from type', typeOfItem, err) })
        }
    }
    // } catch (err) {
    //     logger.error('Failed to get items from type', type, err)
    //     res.status(500).send({ err: ('Failed to get items from type', type, err) })
    // }
}
async function getUserItems(req, res) {
    const { id } = req.params
    //posts!
    try {
        const userPosts = await itemService.queryUserPosts(id)
        res.send(userPosts)
    } catch (error) {
        console.log('error in getUserItems', error);
    }
}
async function getItem(req, res) {
    const { } = req.body
    try {

    } catch (error) {

    }
}

async function addItem(req, res) {
    console.log('adding an item!');
    const { item, typeOfItem } = req.body
    logger.info('(item-controller)adding an item!', item)
    if (typeOfItem === 'post') {
        try {
            const post = await itemService.addPost(item)
            res.send(post)
        } catch (error) {
            logger.error('(item-controller)Error in adding post:', error);
        }
    } else if (typeOfItem === 'comment') {
        try {
            const comment = await itemService.addComment(item)
            res.send(comment)
            // res.send({ message: 'comment was addded!' })
        } catch (error) {
            logger.error('(item-controller)Error in adding comment:', error)
        }
    }
}

async function updateItem(req, res) {
    const { typeOfItem, item } = req.body
    if (typeOfItem === 'post') {
        try {
            const updatedPost = await itemService.updatePost(item)
            //should i also make sure the publisherId equals userId?
            res.send(updatedPost)
        } catch (error) {
            logger.error('(item-controller)Error while Updating Post:', error)
        }
    } else if (typeOfItem === 'comment') {
        try {
            const updatedComment = await itemService.updateComment(item)
            res.send(updatedComment)
        } catch (error) {
            logger.error('(item-controller)Error while Updating Comment:', error)
        }
    }
}
async function removeItem(req, res) {
    const { userId, typeOfItem, itemId, publisherId } = req.body
    if (typeOfItem === 'post') {
        try {
            await itemService.removePost(itemId)
            //should i also make sure the publisherId === userId?
            res.send({ msg: 'Deleted successfully' })
        } catch (error) {
            logger.error('(item-controller)Error in removing post:', error)
        }
    } else if (typeOfItem === 'comment') {
        try {
            await itemService.removeComment(itemId)
            res.send({ msg: 'Deleted successfully' })
        } catch (error) {
            logger.error('(item-controller)Error in removing comment:', error)
        }
    }
}

module.exports = {
    getItem, getItems, removeItem, updateItem, addItem, getUserItems
}