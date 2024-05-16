const express = require('express')
const app = express()
const router = express.Router()
const json = require('./mock.json')
const redis = require('redis')

const client = redis.createClient()

const connectRedis = async () => {
    await client.connect()
}
router.get('/', (req, res) => {
    client.get('jsonData').then((result) => {
        if (result) {
            console.log('isExist')
            res.json(JSON.parse(result))
        } else {
            console.log('notExist')
            res.json(json)
            client.set('jsonData', JSON.stringify(json)).then((value) => {
                console.log('v1', value)
            })

        }
    })
})

router.post('/', (req, res) => {
    const { username } = req.body
    client.set('createData', JSON.stringify(username)).then((value) => {
        console.log('v1', value)
        res.status(201).json({ username })
    })
})

router.get('/user', (req, res) => {
    client.get('dasdasdas').then((result) => {
        if (result) {
            console.log('isExist')
            res.json(JSON.parse(result))
        } else {
            console.log('notExist')
            res.json({ username: Date.now() })
            client.set('createData', JSON.stringify({ username: Date.now() })).then((value) => {
                console.log('v1', value)
            })

        }
    })
})

router.delete('/', (req, res) => {
    const newJson = json.filter((item) => item.id != 1)
    client.del('jsonData').then((result) => {
        console.log('r', result)
    })
    client.set('jsonData', JSON.stringify(newJson)).then((value) => {
        console.log('v1', value)
    })
    res.json({ id: 1 })
})

app.use(express.json())
app.use(router)

connectRedis().then(() => {
    app.listen(3000, () => { })
})