const express = require('express')
const logger = require('morgan')
const cors = require('cors')

const app = express()

app.use(express.json())
app.use(logger('combined'))
app.use(cors())
app.use(express.static('build'))

let phonebook = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/api/persons',(req, res) => {
    res.json(phonebook)
})

app.get('/info',(req, res) => {
    const len = phonebook.length
    const date = new Date()
    res.send(`<p>Phonebook has info for ${len} people <p> ${date} </p>`)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const item = phonebook.find(n=>n.id === id)
    if(item){
        res.json(item)
    }else{
        res.status(404).end()
    }
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
    
    if(phonebook.find(item => body.name === item.name)){
        return res.status(400).json({
            error: 'name must be unique'
        })
    }

    const item = {
        name: body.name,
        number: body.number,
        id: generateId()
    }

    phonebook = phonebook.concat(item)

    res.json(item)

})

app.delete('/api/persons/:id',(req, res) => {
    const id = Number(req.params.id)
    phonebook = phonebook.filter(n => n.id !== id)
    res.send('delete OK!')

    res.status(204).end()
})

const PORT = 3002
app.listen(PORT)
console.log(`server running on port ${PORT}`);