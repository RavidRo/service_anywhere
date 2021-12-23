import express from 'express'
import api from './api'
import guest from './Interface/GuestInterface'
import dashboard from './Interface/DashboardInterface'
import waiter from './Interface/WaiterInterface'

const app = express()
const PORT = process.env.PORT || 3000
app.use(express.json())

app.get('/', (req, res) => {
    res.send('Hello World! 123')
})

//Guest
app.post('/createOrder', (req, res) => {
    res.send(guest.createOrder(req.body['items']));
})

app.post('/updateLocationGuest', (req, res) => {
    guest.updateLocationGuest(req.body["location"], req.body["orderID"])
})

app.get('/hasOrderArrived', (req, res) => {
    res.send(guest.hasOrderArrived(req.body['orderID']))
})

//Dashboard
app.get('/getOrders', (req, res) => {
    res.send(dashboard.getOrders())
})

app.post('/assignWaiter', (req, res) => {
    dashboard.assignWaiter(req.body['orderID'], req.body['waiterID'])
})

app.get('/getWaiters', (req, res) => {
    res.send(dashboard.getWaiters())
})

app.get('/getWaiterByOrder', (req, res) => {
    res.send(dashboard.getWaiterByOrder(req.body['orderID']))
})

//waiter
app.get('/getWaiterOrder', (req, res) => {
    res.send(waiter.getWaiterOrder(req.body['waiterID']))
})

app.get('/getGuestLocation', (req, res) => {
    waiter.getGuestLocation(req.body['orderID'])
})

app.post('/orderArrived', (req, res) => {
    waiter.orderArrived(req.body['orderID'])
})

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`)
})