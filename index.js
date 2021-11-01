const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.d9psq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('travel_time');
        const packageCollection = database.collection('packages');
        const destinationCollection = database.collection('destinations');
        const bookingsCollection = database.collection('bookings');

        // Get API
        app.get('/packages', async (req, res) => {
            const cursor = packageCollection.find({})
            const packages = await cursor.toArray();
            res.send(packages);
        })

        // Post API
        app.post('/packages', async (req, res) => {
            const package = req.body;
            console.log('hit the post api', package)

            const result = await packageCollection.insertOne(package);
            console.log(result);
            res.json(result)

        })

        // Post Booking API
        app.post('/bookings', async (req, res)=>{
            const booking = req.body;
            const result = await bookingsCollection.insertOne(booking);
            res.json(result);
        })

        // Delete Bookings API
        app.delete('/bookings/:id', async(req, res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await bookingsCollection.deleteOne(query);
            res.json(result);
        })

        // Status Update API
        app.put('/bookings/:id', async(req, res)=>{
            const id = req.params.id;
            const updatedStatus = req.body;
            const filter = {_id: ObjectId(id)};
            const options = {upsert: true};
            const updateDoc = {
                $set: {
                    status: updatedStatus.status
                }
            };
            const result = await bookingsCollection.updateOne(filter, updateDoc, options)
            console.log('update', req.body);
            res.json(result)
        })

        // Get Packages API
        app.get('/packages', async (req, res) => {
            const cursor = packageCollection.find({});
            const packages = await cursor.toArray();
            res.send(packages)
        })

        // Get Booking API
        app.get('/bookings', async(req, res) =>{
            const cursor = bookingsCollection.find({});
            const bookings = await cursor.toArray();
            res.send(bookings)
        })

        // Get Destination API
        app.get('/destinations', async(req, res)=>{
            const cursor = destinationCollection.find({});
            const destinations = await cursor.toArray();
            res.json(destinations)
        })

    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Travel Time server is running');
});

app.listen(port, () => {
    console.log('Server running at port', port)
})