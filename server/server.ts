import express from 'express'

const app = express()
const PORT = 3000
app.use(express.json())
app.get('/', (req, res) => {
    res.send('Hello World! 123')
})
app.post('/sendOrder', (req, res) => {
    var items = req.body["items"];
    var location = req.body["location"];
    if (!backend.applyOrder(items, location)){
        res.send('Order Failed');
        return;
    }
    res.send('Order Received Successfully');
})
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`)
})