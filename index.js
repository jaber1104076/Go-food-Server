const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.wbco2uz.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const serviceCollection = client.db('goFood').collection('services')
        const reviewsCollection = client.db('goFood').collection('reviews')

        app.post('/service', async (req, res) => {
            const query = req.body;
            const result = await serviceCollection.insertOne(query)
            res.send(result)
        })



    } catch (error) {
        console.log(error.message, error.status)
    }
}
run()

app.get('/', (req, res) => {
    res.send('goFood server is ruuning')
})

app.listen(port, () => {
    console.log(`Gofood server is running on port : ${port} `)
})