// const mongoDBService = require('../../services/mongo-db-service')
const cloudinary = require('cloudinary')

const logger = require('../../services/logger-service')
// const bcrypt = require('bcrypt')
// const ObjectId = require('mongodb').ObjectId

cloudinary.config({
    cloud_name: 'wordchained',
    api_key: '646791858889346',
    api_secret: 'jZi3D6ip5m5-jyrB8vZjx7EXWVQ',
    secure: true
});

module.exports = {
    //MongoDB Fucntions
    getMedia,
    removeMedia,
    addMedia
}

async function getMedia(userId) {
    // console.log('userId', userId);
    try {
        const media = await cloudinary.v2.api.resources({
            type: 'upload',
            prefix: userId // add your folder
        })
        // console.log('images in getMedia - cloudinary-service', media);
        return media.resources
    } catch (err) {
        logger.error('cannot find posts', err)
        throw err
    }
}
async function addMedia(userId, media) {
    try {
    } catch (err) {
        logger.error('cannot find posts', err)
        throw err
    }
}

async function removeMedia(userId, public_ids) {
    try {
        const res = await cloudinary.v2.api.delete_resources(public_ids);
        // console.log("cldnryService removeMedia res:", res);
        return res
    } catch (err) {
        logger.error('cannot find posts', err)
        throw err
    }
}
