const express = require('express')
const uuid = require('uuid')

const app = express()
app.use(express.json())

const port = 3000
const orders = []

const checkOrderId = (request, response, next) => {
    const { id } = request.params
    const index = orders.findIndex(newOrder => newOrder.id === id)

    if (index < 0) {
        return response.status(404).json({error: "order not found"})
    }

    request.orderId = id
    request.orderIndex = index

    next()
}

app.use((request, response, next) => {
    console.log(`[${request.method}] ${request.url}`)
    
    next()
})

app.post('/order', (request, response) => {
    const { order, clientName, price, status } = request.body

    const newOrder = { id: uuid.v4(), order, clientName, price, status }

    orders.push(newOrder)

    return response.status(201).json(newOrder)
})

app.get('/order', (request, response) => response.json(orders))

app.put('/order/:id', checkOrderId, (request, response) => {
    const { order, clientName, price, status } = request.body
    const id = request.orderId
    const index = request.orderIndex

    const updateOrder = { id, order, clientName, price, status }

    orders[index] = updateOrder

    return response.json(updateOrder)
})

app.delete('/order/:id', checkOrderId, (request, response) => {
    const index = request.orderIndex

    orders.splice(index, 1)

    return response.status(204).json()
})

app.get('/order/:id', checkOrderId, (request, response) => {
    const index = request.orderIndex
    const orderIndex = orders[index]

    return response.json(orderIndex)
})

app.patch('/order/:id', checkOrderId, (request, response) => {
    const index = request.orderIndex

    orders[index].status = 'Pronto'

    return response.json(orders[index])
})

app.listen(port, () => console.log('🚀 Starting...'))