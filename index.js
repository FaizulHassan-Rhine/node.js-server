const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

const cors = require('cors');

app.use(cors());
app.use(express.json());


// const uri = `mongodb+srv://shafayat:mUg7OkL70WB9GbUv@cluster-writecraft.sexjkjn.mongodb.net/?retryWrites=true&w=majority`;
const uri = "mongodb+srv://technet:8h0xdLJqj9ZgYr3n@cluster2.e7iulfl.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri);

let db = client.db("tech-net");



app.get("/products", async (req, res) => {



    // let collection = await db.collection("product");

    // let query = { user_uid: req.body.uid };

    // let results = await collection.find(query)

    //     .limit(50)

    //     .toArray();



    // console.log(results)

    res.send("hello").status(200);



})


app.get('/', (req, res) => {
    res.send('Technet Run');
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
