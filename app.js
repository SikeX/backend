// 建立到数据库的连接
const config = require('./utils/config') // 环境变量配置模块
const express = require('express')
const app = express()
const cors = require('cors')
const phonebookRouter = require('./controllers/phonebook') //phonebook路由模块
const morgan = require('morgan') // requset 连接日志中间件
const logger = require('./utils/logger') // 日志模块
const mongoose = require('mongoose')  //连接MongoDB组件
const middleware = require('./utils/middleware') //自定义中间件

logger.info('connecting to', config.MONGGO_URI)

mongoose.connect(config.MONGGO_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
    .then(() => {
        logger.info('connected to MongoDB')
    })
    .catch((error) => {
        logger.info('error connecting to MongoDB:', error.message)
    })


app.use(morgan('combined'))
app.use(express.json()) // express json 中间件

app.use(cors())
app.use(express.static('build'))
app.use(middleware.requestLogger)

app.use('/api/persons',phonebookRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app