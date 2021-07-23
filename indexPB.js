const app = require('./app')
const http = require('http')
const config = require('./utils/config')
const logger = require('./utils/logger')

const PORT = config.PORT || 3002

const server = http.createServer(app)

server.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`)
})