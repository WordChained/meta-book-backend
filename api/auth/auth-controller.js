const authService = require('./auth-service')
const logger = require('../../services/logger-service')

const login = async (req, res) => {
    const { email, password } = req.body
    console.log(email, password);
    try {
        const user = await authService.login(email, password)
        if (req.session) req.session.user = user//need to set req.session.user !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        res.json(user)
    } catch (err) {
        logger.error('(auth-controller) Failed to Login ' + err)
        res.status(401).send({ message: 'Failed to Login' })
    }
}

const signup = async (req, res) => {
    try {
        const { userCred } = req.body
        console.log(userCred);
        const { name, password, profilePicture, DOB, email, sex, address, educationInfo, careerInfo, createdAt } = userCred//DOB is date of birth
        // Never log passwords
        const account = await authService.signup(name, password, profilePicture, DOB, email, sex, createdAt, address, educationInfo, careerInfo)
        logger.debug(`auth-route - new account created: ` + JSON.stringify(account))
        const user = await authService.login(email, password)
        if (req.session) req.session.user = user
        res.json(user)
    } catch (err) {
        if (err.status === 409) {
            res.status(409).send({ message: err })
        } else {
            logger.error('Failed to signup ' + err)
            res.status(500).send({ err: err })
        }
    }
}

const logout = async (req, res) => {
    try {
        req.session.destroy()
        res.send({ msg: 'Logged out successfully' })
    } catch (err) {
        res.status(500).send({ err: 'Failed to logout' })
    }
}

module.exports = {
    login,
    signup,
    logout
}