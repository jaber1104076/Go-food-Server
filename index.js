const express = require('express');
const cors = require('cors');
var jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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

        app.get('/services', async (req, res) => {
            const query = {}
            const cursor = serviceCollection.find(query)
            const service = await cursor.limit(3).toArray()
            res.send(service)
        })
        app.get('/all-services', async (req, res) => {
            const query = {}
            const cursor = serviceCollection.find(query)
            const service = await cursor.toArray()
            res.send(service)
        })
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const cursor = serviceCollection.find(query)
            const service = await cursor.toArray()
            res.send(service)
        })

        app.post('/reviews', async (req, res) => {
            const query = req.body;
            const result = await reviewsCollection.insertOne(query)
            res.send(result)
        })
        app.get('/reviews', async (req, res) => {
            const query = {}
            const cursor = reviewsCollection.find(query)
            const reviews = await cursor.toArray()
            res.send(reviews)
        })
        app.get('/review', async (req, res) => {
            let query = {}
            if (req.query.email) {
                query = {
                    email: req.query.email
                }
            }
            const cursor = reviewsCollection.find(query)
            const review = await cursor.toArray()
            res.send(review)
        })
        app.delete('/review/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const remain = await reviewsCollection.deleteOne(query)
            res.send(remain)
        })
        app.get("/myreviews/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await reviewsCollection.findOne(query)
            res.send(result)
        })
        // Update data
        app.patch('/review/:id', async (req, res) => {
            const id = req.params.id;
            const query = req.body;
            const filter = { _id: ObjectId(id) }
            const updateDoc = {
                $set: query
            }
            const result = await reviewsCollection.updateOne(filter, updateDoc)
            res.send(result)
        });


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