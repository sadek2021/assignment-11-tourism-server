const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.d9psq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('travel_time');
        const packageCollection = database.collection('packages');

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

        // Get Packages API
        app.get('/packages', async (req, res) => {
            const cursor = packageCollection.find({});
            const packages = await cursor.toArray();
            res.send(packages)
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