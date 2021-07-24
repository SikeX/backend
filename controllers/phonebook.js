// phonebook 路由功能

const phonebookRouter = require('express').Router()
const Phonebook = require('../models/phone')

phonebookRouter.get('/',async (req, res) => {
    const items = await Phonebook.find({})
    res.json(items)
})

// app.get('/info',(req, res) => {
//     const len = phonebook.length
//     const date = new Date()
//     res.send(`<p>Phonebook has info for ${len} people <p> ${date} </p>`)
// })

phonebookRouter.get('/:id', async (req, res, next) => {
    try {
        const founedItem = await Phonebook.findById(req.params.id)

        if (founedItem) {
            res.json(founedItem)
        } else {
            res.status(404).end()
        }
    } catch(exception) {
        next(exception)
    } 
})

// const generateId = () => {
//     const maxId = phonebook.length > 0
//         ? Math.max(...phonebook.map(item => item.id))
//         : 0

//     return maxId + 1
// }

phonebookRouter.post('/',async (req, res, next) => {
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

    try {
        const savedItem = await item.save()
        res.json(savedItem)
    } catch(exception) {
        next(exception)
    }
})

phonebookRouter.delete('/:id',async (req, res, next) => {
    try {
        await Phonebook.findByIdAndRemove(req.params.id)
        res.status(204).end()
    } catch(exception) {
        next(exception)
    }
})

module.exports = phonebookRouter