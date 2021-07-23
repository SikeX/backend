require('dotenv').config()

let PORT = process.env.PORT
let MONGGO_URI = process.env.MONGGO_URI

module.exports = {
    MONGGO_URI,
    PORT
}