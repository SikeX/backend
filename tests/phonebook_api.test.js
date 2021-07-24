const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')

const api = supertest(app)

const Phonebook = require('../models/phone')


beforeEach(async () => {
    await Phonebook.deleteMany({})
    
    const itemObjects = helper.initialItems
        .map(item => new Phonebook(item))
    const promiseArray = itemObjects.map(item => item.save())
    await Promise.all(promiseArray)
    // await Phonebook.insertMany(helper.initialItems)
})


describe('when there is initially some notes saved', () => {
    test('phonebook returned as json', async () => {
        await api
            .get('/api/persons')
            .expect(200)
            .expect('Content-Type',/application\/json/)
    }, 100000)

    test('all notes are returned', async () => {
        const response = await api.get('/api/persons')
    
        expect(response.body).toHaveLength(helper.initialItems.length)
    })

    test('a specific item is within the returned notes', async () => {
        const response = await api.get('/api/persons')
    
        const name = response.body.map(r => r.name)
        expect(name).toContain(
            'sike'
        )
    })
})


describe('viewing a specific item', () => {
    test('succeeds with a valid id', async () => {
        const itemsAtStart = await helper.itemsInDb()
        
        const itemToView = itemsAtStart[0]

        const resultItem = await api
            .get(`/api/persons/${itemToView.id}`)
            .expect(200)
            .expect('Content-Type',/application\/json/)

        const processedItemToView = JSON.parse(JSON.stringify(itemToView))
        expect(resultItem.body).toEqual(processedItemToView)
    })

    test('fails with statuscode 404 id note does not exist', async () => {
        const validNonexistingId = await helper.nonExistingId()

        console.log(validNonexistingId)

        await api
            .get(`/api/persons/${validNonexistingId}`)
            .expect(404)
    })

    test('fails with statuscode 400 id is invalid', async () => {
        const invalidId = '5a3d5da59070081a82a3445'
    
        await api
            .get(`/api/persons/${invalidId}`)
            .expect(400)
    })
})

describe('addition of a new item', () => {
    test('a valid item can be added', async () => {
        const newPhonebook = {
            name: 'rick',
            number: '32332-3223',
        }
    
        await api
            .post('/api/persons')
            .send(newPhonebook)
            .expect(200)
            .expect('Content-Type', /application\/json/)
    
        const response = await api.get('/api/persons')
    
        const names = response.body.map(r => r.name)
    
        expect(response.body).toHaveLength(helper.initialItems.length + 1)
        expect(names).toContain('rick')
    })

    test('item without name or number is not added',async () => {
        const newItem = {
            name: 'jerry'
        }
    
        await api
            .post('/api/persons')
            .send(newItem)
            .expect(400)
    
        const response = await api.get('/api/persons')
    
        expect(response.body).toHaveLength(helper.initialItems.length)
    })
})

afterAll(() => {
    mongoose.connection.close()
})