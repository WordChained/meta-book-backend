// const { mongoPassword } = require("../secrets");

module.exports = {
    'dbURL': `mongodb+srv://tal51:${process.env.mongoPassword}@cluster0.p3oka.mongodb.net/metabook_db?retryWrites=true&w=majority`,
}