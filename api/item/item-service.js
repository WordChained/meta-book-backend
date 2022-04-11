const mongoDBService = require('../../services/mongo-db-service')
const logger = require('../../services/logger-service')
const friendsService = require('../friends/friends-service')
const userService = require('../user/user-service')

// const reviewService = require('../review/review-service')
const bcrypt = require('bcrypt')
const ObjectId = require('mongodb').ObjectId

module.exports = {
    //MongoDB Fucntions
    queryInPosts,
    queryInComments,
    getById,
    removePost,
    removeComment,
    updatePost,
    updateComment,
    addPost,
    addComment,
    queryUserPosts
}

async function queryInPosts(userId) {
    // const criteria = {}
    let friends;
    try {
        friends = await friendsService.queryFriends(userId)
    } catch (err) {
        console.log('error fetching friends in queryInPosts', err);
    }
    const ids = friends.map(friend => friend.userId)
    ids.push(userId)
    console.log('friends ids in queryPosts:', ids);
    try {
        const collection = await mongoDBService.getCollection('post')
        let posts = await collection.find({ "publisher.id": { $in: ids } }).sort({ date: -1 }).toArray()
        const postsWithPublisherInfoAndComments = Promise.all(posts.map(async post => {
            const publisher = await userService.getUserById(post.publisher.id)
            const comments = await _getPostComments(post._id)
            // console.log("can i find a post?", post);
            return {
                ...post,
                publisher: {
                    id: post.publisher.id,
                    profilePicture: publisher.profilePicture,
                    name: publisher.name
                },
                engagement: {
                    ...post.engagement,
                    comments
                }
            }
        }))
        // const postsWithComments = Promise.all(postsWithPublisherInfo.map(async (post) => {
        //     post.engagement.comments = await _getPostComments(post._id)
        //     return post
        // }))
        return postsWithPublisherInfoAndComments
    } catch (err) {
        logger.error('cannot find posts', err)
        throw err
    }
}
async function _getPostComments(postId) {
    try {
        const collection = await mongoDBService.getCollection('comment')
        let comments = await collection.find({ 'parentId': postId.toString() }).toArray()
        return comments
    } catch (err) {
        logger.info('cannot find comments', err)
        return []
        // throw err
    }
}
async function queryInComments() {
    // const criteria = {}
    try {
        const collection = await mongoDBService.getCollection('comment')
        let comments = await collection.find().toArray()
        return comments
    } catch (err) {
        logger.error('cannot find comments', err)
        throw err
    }
}
async function queryUserPosts(userId) {
    try {
        const collection = await mongoDBService.getCollection('post')
        let posts = await collection.find({ 'publisher.id': userId }).toArray()
        const postsWithPublisherInfoAndComments = Promise.all(posts.map(async post => {
            const publisher = await userService.getUserById(post.publisher.id)
            const comments = await _getPostComments(post._id)
            // console.log("can i find a post?", post);
            return {
                ...post,
                publisher: {
                    id: post.publisher.id,
                    profilePicture: publisher.profilePicture,
                    name: publisher.name
                },
                engagement: {
                    ...post.engagement,
                    comments
                }
            }
        }))
        console.log("trying to fetch posts", postsWithPublisherInfoAndComments[0]);
        return postsWithPublisherInfoAndComments
    } catch (error) {
        logger.error('queryUserPosts item-service', error)
    }
}
async function getById(typeOfItem = 'post', itemId) {
    try {
        const collection = await mongoDBService.getCollection(typeOfItem)
        const item = await collection.findOne({ '_id': ObjectId(itemId) })
        return item
    } catch (err) {
        logger.error(`while finding the ${typeOfItem} with id: ${userId}. Error:`, err)
        throw err
    }
}
// async function getByUsername(userName) {
//     try {
//         const collection = await mongoDBService.getCollection('user')
//         const user = await collection.findOne({ userName })
//         // logger.debug('getByusername:', user)
//         return user
//     } catch (err) {
//         logger.error(`while finding user ${userName}`, err)
//         throw err
//     }
// }

async function removePost(postId) {
    try {
        const collection = await mongoDBService.getCollection('post')
        await collection.deleteOne({ '_id': ObjectId(postId) })
    } catch (err) {
        logger.error(`cannot remove post with the id: ${postId}. Error:`, err)
        throw err
    }
}
async function removeComment(commentId) {
    try {
        const collection = await mongoDBService.getCollection('comment')
        await collection.deleteOne({ '_id': ObjectId(commentId) })
    } catch (err) {
        logger.error(`cannot remove comment with the id: ${commentId}. Error:`, err)
        throw err
    }
}

async function updatePost(post) {
    try {
        // peek only updatable fields!
        const postToSave = {
            _id: ObjectId(post._id),
            text: post.text,
            media: post.media,
            publisher: post.publisher,
            engagement: post.engagement,
            date: post.date,
            modifiedAt: Date.now(),
            feeling: post.feeling
        }
        const collection = await mongoDBService.getCollection('post')
        const updatedPostStatus = await collection.updateOne({ '_id': ObjectId(post._id) }, { $set: postToSave })
        if (updatedPostStatus.modifiedCount === 0) throw { message: "couldn't find post" }
        return postToSave;
    } catch (err) {
        logger.error(`cannot update post ${post._id}. Error:`, err)
        throw err
    }
}
async function updateComment(comment) {
    // const isAdmin = JSON.parse(user.isAdmin);
    // console.log(isAdmin);
    try {
        // peek only updatable fields!
        const commentToSave = {
            _id: ObjectId(comment._id),
            parentId: comment.parentId,
            publisher: comment.publisher,
            text: comment.text,
            media: comment.media,
            engagement: comment.engagement,
            date: comment.date,
            // history: []
            modifiedAt: Date.now()
        }
        const collection = await mongoDBService.getCollection('comment')
        await collection.updateOne({ '_id': ObjectId(comment._id) }, { $set: commentToSave })
        return commentToSave;
    } catch (err) {
        logger.error(`cannot update comment ${comment._id}. Error:`, err)
        throw err
    }
}

async function addPost(post) {
    // const {text,media,publisher } = post
    try {
        const postToAdd = {
            ...post,
            engagement: { reactions: { likes: [], angry: [], love: [], sad: [], happy: [] }, comments: [] },
            date: Date.now()
        }
        const collection = await mongoDBService.getCollection('post')
        await collection.insertOne(postToAdd)
        return postToAdd
    } catch (err) {
        logger.error('cannot insert post', err)
        throw err
    }
}
async function addComment(comment) {
    try {
        const commentToAdd = {
            ...comment,
            engagement: {
                reactions: { likes: [], angry: [], love: [], sad: [], happy: [] },
                comments: []
            },
            date: new Date().getTime()
        }
        const collection = await mongoDBService.getCollection('comment')
        await collection.insertOne(commentToAdd)
        console.log(commentToAdd);
        return commentToAdd
    } catch (err) {
        logger.error('cannot insert comment', err)
        throw err
    }
}

function _buildCriteria(filterBy) {
    const criteria = {}
    return criteria;
    if (filterBy.txt) {
        const txtCriteria = { $regex: filterBy.txt, $options: 'i' }
        criteria.$or = [{
            userName: txtCriteria
        },
        {
            fullName: txtCriteria
        }
        ]
    }
    if (filterBy.minBalance) {
        criteria.balance = { $gte: filterBy.minBalance }
    }
    return criteria
}