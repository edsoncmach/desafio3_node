const express = require('express')
const app = express()
const uuid = require('uuid')
app.use(express.json())
const port = 3000

const orders = []

app.get('/orders', (request, response) => {
    response.json(orders)
})

app.post('/orders', (request, response) => {
    const { order, clientName, price, status } = request.body
    const newOrder = { id: uuid.v4(), order, clientName, price, status: "Em preparação" }

    orders.push(newOrder)

    return response.status(201).json(newOrder)
})

app.put('/orders/:id', (request, response) => {
    const { id } = request.params
    const { order, clientName, price, status } = request.body
    const updateOrder = { id, order, clientName, price, status }
    const index = orders.findIndex(order => order.id === id)

    if(index < 0) {
        return response.status(404).json({ message: "User not found!"})
    }

    orders[index] = updateOrder

    return response.json(updateOrder)
})

app.delete('/orders/:id', (request, response) => {
    const { id } = request.params
    const index = orders.findIndex(order => order.id === id)
    
    if(index < 0) {
        return response.status(404).json({ message: "User not found!"})
    }

    orders.splice(index, 1)

    return response.status(204).json()
})

app.patch('/orders/:id', (request, response) => {
    const id = request.params.id
    const index = orders.findIndex(order => order.id === id)

    if(index < 0) {
        return response.status(404).json({ message: "User not found!"})
    }

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