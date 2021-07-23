// phonebook 路由功能

const phonebookRouter = require('express').Router()
const Phonebook = require('../models/phone')

phonebookRouter.get('/',(req, res) => {
    Phonebook.find({}).then(phonebook => {
        res.json(phonebook)
    })
})

// app.get('/info',(req, res) => {
//     const len = phonebook.length
//     const date = new Date()
//     res.send(`<p>Phonebook has info for ${len} people <p> ${date} </p>`)
// })

phonebookRouter.get('/:id', (req, res, next) => {
    Phonebook.findById(req.params.id).then(item => {
        if(item){
            res.json(item)
        } else {
            res.status(400).end()
        }
    })
        .catch(error => next(error))
})

// const generateId = () => {
//     const maxId = phonebook.length > 0
//         ? Math.max(...phonebook.map(item => item.id))
//         : 0

//     return maxId + 1
// }

phonebookRouter.post('/',(req, res, next) => {
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

    item.save()
        .then(saveItem => {
            res.json(saveItem)
        })
        .catch(error => next(error))
})

phonebookRouter.delete('/:id',(req, res, next) => {
    Phonebook.findByIdAndRemove(req.params.id)
        .then(() => {
            res.status(204).end()
        })
        .catch(error => next(error))
})

module.exports = phonebookRouter