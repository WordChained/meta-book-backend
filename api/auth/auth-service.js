const bcrypt = require('bcrypt')
const userService = require('../user/user-service')
const logger = require('../../services/logger-service')


const login = async (email, password) => {
    logger.debug(`auth-service - login with email: ${email}`)
    try {
        const user = await userService.getUserByEmail(email)
        if (!user) return Promise.reject('Invalid email')
        const match = await bcrypt.compare(password, user.password)
        if (!match) return Promise.reject('Invalid password')
        delete user.password
        return user
    } catch (err) {
        logger.error('Login error in service.', err)
        throw err
    }
}

const signup = async (name, password, profilePicture, DOB, email, sex, createdAt, address, educationInfo, careerInfo) => {
    const saltRounds = 10
    logger.debug(`auth-service - signup with name: ${name.first}, email: ${email}`)
    if (!name || !password || !email) return Promise.reject('name, password and email are required!')
    const hash = await bcrypt.hash(password, saltRounds)
    try {
        return await userService.signup({ name, password: hash, profilePicture, DOB, email, sex, createdAt, address, educationInfo, careerInfo })
    } catch (error) {
        console.log('auth-service signup error:', error);
        throw error
    }
}

module.exports = {
    signup,
    login,
}