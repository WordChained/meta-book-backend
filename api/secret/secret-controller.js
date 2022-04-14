const secretService = require('./secret-service')


async function getSecret(req, res) {
    try {
        const secret = await secretService.getSecret()
        res.send(secret)
    } catch (error) {
        logger.error('getSecret error.', error)
    }

}
module.exports = {
    getSecret
}