const express = require('express')
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()


const cors = require('cors')
const app = express();
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.g008r.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });



async function run() {
    try {
        await client.connect();
        // console.log("connected to db");

        const database = client.db("carMechabicService");
        const serviceCollection = database.collection("service");




        // POST API
        app.post('/addService', async (req, res) => {
            const service = req.body;
            console.log("hit the adding process  post api", service);

            const result = await serviceCollection.insertOne(service);
            console.log(result);
            res.json(result)

        })

        // get all api
        app.get('/services', async (req, res) => {

            const services = await serviceCollection.find({}).toArray();
            res.json(services)
            // console.log(services);
        })


        // get single api
        app.get('/service/:id', async (req, res) => {
            const id = req.params.id;

            const service = await serviceCollection.findOne({ _id: (ObjectId(id)) });
            console.log("getting id ", id);
            res.send(service)
            // console.log(service);
        })
        // delete single data (API)
        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const result = await serviceCollection.deleteOne({ _id: (ObjectId(id)) })
            res.json(result)


        })



    }

    finally {
        // await client.close();
    }
}

run().catch(console.dir);








app.get('/', (req, res) => {
    res.send("node server running")
})
app.listen(port, () => {
    console.log("listening to  port : ", port);
})