const Phonebook = require('../models/phone')

const initialItems = [
    {
        name: 'sike',
        number: '1234-5678',
    },
    {
        name: 'morty',
        number: '2345-6789',
    }
]

const nonExistingId = async () =>{
    const item = new Phonebook({name: 'willremovesoon'})
    await item.save()
    await item.remove()

    return item._id.toString()
}

const itemsInDb = async () =>{
    const items = await Phonebook.find({})
    return items.map(item => item.toJSON())
}

module.exports = {
    initialItems,nonExistingId,itemsInDb
}