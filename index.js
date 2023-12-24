const express = require('express')
const app = express()
app.use(express.json())
const uuid = require('uuid')
const API = require('./controller/API')

const port = 3000
const clients = []

function updateStatus(clients, id) {
    for (let i = 0; i < clients.length; i++) {
        if (clients[i].id === id) {
            clients[i].status = 'Pronto'

            return clients[i]
            break
        }
    }
}

const checkCLientId = (req, res, next) => {
    const { id } = req.params

    const index = clients.findIndex(client => client.id === id)

    if (index < 0) {
        return res.status(404).json({ error: 'Cliente não encontrado' })
    }

    req.clientIndex = index
    req.clientId = id

    next()
}

app.get('/order', (req, res) => {
    try {

        if (clients.length > 0) {
            let handlerApi = new API(200, "Todos os pedidos foram retornados com sucesso", clients)

            return res.status(200).json({
                data: handlerApi.response()
            })
        }else{
            let handlerApi = new API(404, "Não há pedidos registrados", clients)

            return res.status(404).json({
                data: handlerApi.response()
            })
        }

    } catch (err) {
        console.log(err)
    }
})

app.get('/order/:id', checkCLientId, (req, res) => {

    const index = req.clientIndex

    const client = clients[index]

    let handlerApi = new API(200, "Todos os pedidos foram retornados com sucesso", client)

    return res.status(200).json({
        data: handlerApi.response()
    })
})

app.put('/order/:id', checkCLientId, (req, res) => {
    const id = req.clientId
    const index = req.clientIndex
    const { order, clientName, price, status } = req.body

    const updateClient = { id, order, clientName, price, status }

    clients[index] = updateClient

    return res.json(updateClient)

})

app.post('/order', (req, res) => {
    const { order, clientName, price, status } = req.body

    const client = { id: uuid.v4(), order, clientName, price, status }

    clients.push(client)

    return res.status(201).json(client)
})

app.patch('/order/:id', checkCLientId, (req, res) => {
    const id = req.clientId

    const newOrder = updateStatus(clients, id)

    const index = req.clientIndex

    clients[index] = newOrder

    return res.status(200).json(newOrder)
})

app.delete('/order/:id', checkCLientId, (req, res) => {
    const index = req.clientIndex

    clients.splice(index, 1)

    return res.status(204).json()
})

app.listen(port, () => {
    console.log(`Server Starting on port ${port}`)
})