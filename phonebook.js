require('dotenv').config() //env中的量是全局可用的
const express = require('express')
const logger = require('morgan')
const cors = require('cors')

const app = express()

app.use(express.json())
app.use(logger('combined'))
app.use(cors())
app.use(express.static('build'))

const Phonebook = require('./models/phone')


app.get('/api/persons',(req, res) => {
    Phonebook.find({}).then(phonebook => {
        res.json(phonebook)
    })
})

app.get('/info',(req, res) => {
    const len = phonebook.length
    const date = new Date()
    res.send(`<p>Phonebook has info for ${len} people <p> ${date} </p>`)
})

app.get('/api/persons/:id', (req, res, next) => {
    Phonebook.findById(req.params.id).then(item => {
        if(item){
            res.json(note)
        } else {
            res.status(400).end()
        }
    })
    .catch(error => next(error))
})

const generateId = () => {
    const maxId = phonebook.length > 0
        ? Math.max(...phonebook.map(item => item.id))
        : 0

    return maxId + 1
}

app.post('/api/persons',(req, res) => {
    const body = req.body
    
    if(!body.name){
        return res.status(400).json({
          error: 'name missing'
        })
    }

    if(!body.number){
        return res.status(400).json({
          error: 'number missing'
        })
    }
    
    // if(Phonebook.find(item => body.name === item.name)){
    //     return res.status(400).json({
    //         error: 'name must be unique'
    //     })
    // }

    const item = new Phonebook({
        name: body.name,
        number: body.number,
    })

    item.save().then(saveItem => {
        res.json(saveItem)
    })
})

app.delete('/api/persons/:id',(req, res, next) => {
    Phonebook.findByIdAndRemove(req.params.id)
        .then(result => {
            res.status(204).end()
        })
        .catch(error => next(error))
})

const PORT = process.env.PORT || 3002
app.listen(PORT)
console.log(`server running on port ${PORT}`);