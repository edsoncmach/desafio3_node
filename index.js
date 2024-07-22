const express = require('express')
const app = express()
const uuid = require('uuid')
app.use(express.json())
const port = 3000

const orders = []

const checkUSerId = (request, response, next) => {
    const { id } = request.params
    const index = orders.findIndex(order => order.id === id)

    if(index < 0) {
        return response.status(404).json({ error: "User not found!"})
    }

    request.userIndex = index
    request.userId = id

    next()
}

const methodAndUrl = (request, response, next) => {
    const method = request.method
    const url = request.url

    console.log(`${method} - ${url}`)

    next()
}

app.get('/orders', methodAndUrl, (request, response) => {
    response.json(orders)
})

app.post('/orders', methodAndUrl, (request, response) => {
    try {
        const { order, clientName, price, status } = request.body
        const newOrder = { id: uuid.v4(), order, clientName, price, status: "Em preparação" }

        orders.push(newOrder)

        return response.status(201).json(newOrder)
    } catch(err){
        return response.status(500).json({ erro: err.message })
    }
})

app.put('/orders/:id', checkUSerId, methodAndUrl, (request, response) => {
    const { order, clientName, price, status } = request.body
    const index = request.userIndex
    const id = request.userId
    const updateOrder = { id, order, clientName, price, status }
    
    orders[index] = updateOrder

    return response.json(updateOrder)
})

app.delete('/orders/:id', checkUSerId, methodAndUrl, (request, response) => {
    const index = request.userIndex
    orders.splice(index, 1)

    return response.status(204).json()
})

app.patch('/orders/:id', checkUSerId, methodAndUrl, (request, response) => {
    const index = request.userIndex
    const oldOrder = orders[index]
    const updateStatus = {
        ...oldOrder,
        ...request.body
    }

    orders[index] = updateStatus

    return response.json(updateStatus)
})

app.listen(port, () => {
    console.log(`🚀 Servidor funcionando na porta ${port}`)
})