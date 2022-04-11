
const cloudinaryService = require('./cloudinary-service')
const logger = require('../../services/logger-service')




async function getMedia(req, res) {
    try {
        const images = await cloudinaryService.getMedia(req.params.id)
        res.send(images)
    } catch (error) {
        logger.error('getMedia error.', error)
    }

}
async function addMedia(req, res) {
    const { media, userId } = req.body
    try {
        const images = await cloudinaryService.addMedia(userId, media)
        res.send(images)
    } catch (error) {
        logger.error('addMedia error.', error)
    }

}
async function removeMedia(req, res) {
    const { userId, public_ids } = req.body
    try {
        await cloudinaryService.removeMedia(userId, public_ids)
        res.send({ mwssage: 'media removed!' })
    } catch (error) {
        logger.error('removeImage error.', error)
    }

}

module.exports = {
    getMedia, removeMedia, addMedia
}