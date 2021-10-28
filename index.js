const { MongoClient } = require("mongodb");
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const ObjectId = require("mongodb").ObjectId;

const app = express();

// port
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// database setup
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.amqnd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// connection setup
async function run() {
    try {
        await client.connect();
        const database = client.db("FoodMaster");
        const usersCollection = database.collection("users");

        // Get API
        app.get("/users", async (req, res) => {
            const cursor = usersCollection.find({});
            const users = await cursor.toArray();
            res.send(users);
        });

        app.get("/users/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const user = await usersCollection.findOne(query);
            console.log("load user with id: ", id);

            res.send(user);
        });

        // Update API
        app.put("/user/:id", async (req, res) => {
            const id = req.params.id;
            console.log("updating user", id);
            res.send("updating not dating");
        });

        // post API
        app.post("/users", async (req, res) => {
            const newUser = req.body;
            const result = await usersCollection.insertOne(newUser);

            res.send(result);
        });

        // Delete API
        app.delete("/users/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await usersCollection.deleteOne(query);

            console.log("deleting user with id", result);

            res.json(result);
        });
    } finally {
        // await client.close();
    }
}
run().catch(console.dir);

// app.METHOD
app.get("/", (req, res) => {
    res.send("Running my CRUD server");
});
app.listen(port, () => {
    console.log("running server on port", port);
});
