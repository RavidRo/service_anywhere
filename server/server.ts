import express from 'express'
import api from './api'
import guest from './Interface/GuestInterface'
import dashboard from './Interface/DashboardInterface'
import waiter from './Interface/WaiterInterface'

var cors = require('cors')
const app = express()
const PORT = process.env.PORT || 3000
app.use(express.json())


// use it before all route definitions
app.use(cors({origin: '*'}))

app.get('/', (req, res) => {
    res.send('Hello World! 123')
})

function checkInputs(inputs: string[], reqBody: any, sendErrorMsg: (msg: string) => void, doIfLegal: () => void){
    let answer = ''
    let missing = false
    for (const input of inputs){
        if(!(input in reqBody)){
            answer += `\"${input}\", `
            missing = true
        }
    }
    if(missing){
        answer = answer.substring(0, answer.length-2) + ' not in request.'
        sendErrorMsg(answer)
    }
    else{
        doIfLegal()
    }
}

//Guest
app.post('/createOrder', (req, res) => {
    checkInputs(['items'], req.body, (msg: string) => res.send(msg), () => res.send(guest.createOrder(req.body['items'])))
})

app.post('/updateLocationGuest', (req, res) => {
    checkInputs(['location', 'orderID'], req.body, (msg: string) => res.send(msg),
     () => guest.updateLocationGuest(req.body["location"], req.body["orderID"]))
})

app.get('/hasOrderArrived', (req, res) => {
    checkInputs(['orderID'], req.body, (msg: string) => res.send(msg), () => res.send(guest.hasOrderArrived(req.body['orderID'])))
})

//Dashboard
app.get('/getOrders', (req, res) => {
    res.send(dashboard.getOrders())
})

app.post('/assignWaiter', (req, res) => {
    checkInputs(['orderID', 'waiterID'], req.body, (msg: string) => res.send(msg),
     () => dashboard.assignWaiter(req.body['orderID'], req.body['waiterID']))
})

app.get('/getWaiters', (req, res) => {
    res.send(dashboard.getWaiters())
})

app.get('/getWaiterByOrder', (req, res) => {
    checkInputs(['orderID'], req.body, (msg: string) => res.send(msg), () => res.send(dashboard.getWaiterByOrder(req.body['orderID'])))
})

//waiter
app.get('/getWaiterOrder', (req, res) => {
    checkInputs(['waiterID'], req.body, (msg: string) => res.send(msg), () => res.send(waiter.getWaiterOrder(req.body['waiterID'])))
})

app.get('/getGuestLocation', (req, res) => {
    checkInputs(['orderID'], req.body, (msg: string) => res.send(msg), () => waiter.getGuestLocation(req.body['orderID']))
})

app.post('/orderArrived', (req, res) => {
    checkInputs(['orderID'], req.body, (msg: string) => res.send(msg), () => waiter.orderArrived(req.body['orderID']))
})

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`)
})