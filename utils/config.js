require('dotenv').config()

let PORT = process.env.PORT
let MONGGO_URI = process.env.NODE_ENV === 'test'
    ? process.env.TEST_MONGGO_URI
    : process.env.MONGODB_URI

module.exports = {
    MONGGO_URI,
    PORT
}