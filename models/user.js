const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator') //用户名唯一性

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true
    },
    name: String,
    passwordHash: String,
    items: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Phonebook'
    }],
})

userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
        delete returnedObject.passwordHash
    }
})

userSchema.plugin(uniqueValidator)

const User = mongoose.model('User',userSchema)

module.exports = User