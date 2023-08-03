const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

const cors = require('cors');

app.use(cors());
app.use(express.json());

// const uri = "mongodb+srv://technet:1UyVYFbz9KAVP458@cluster2.e7iulfl.mongodb.net/?retryWrites=true&w=majority";
var uri = "mongodb://technet:8h0xdLJqj9ZgYr3n@ac-wri3jau-shard-00-00.e7iulfl.mongodb.net:27017,ac-wri3jau-shard-00-01.e7iulfl.mongodb.net:27017,ac-wri3jau-shard-00-02.e7iulfl.mongodb.net:27017/?ssl=true&replicaSet=atlas-ozauju-shard-0&authSource=admin&retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const run = async () => {
  try {
    await client.connect(); // Establish the connection to the MongoDB server
    console.log('Connected to MongoDB server');

    const db = client.db('tech-net');
    const productCollection = db.collection('product');
    const userCollection = db.collection('user');

    app.get('/products', async (req, res) => {
      const cursor = productCollection.find({});
      const products = await cursor.toArray();
      res.send({ status: true, data: products });
    });

    app.post('/product', async (req, res) => {
      const product = req.body;

      const result = await productCollection.insertOne(product);

      res.send(result);
    });

    app.get('/product/:id', async (req, res) => {
      const id = req.params.id;

      const result = await productCollection.findOne({ _id: ObjectId(id) });
      console.log(result);
      res.send(result);
    });

    app.delete('/product/:id', async (req, res) => {
      const id = req.params.id;

      const result = await productCollection.deleteOne({ _id: ObjectId(id) });
      console.log(result);
      res.send(result);
    });

    app.post('/comment/:id', async (req, res) => {
      const productId = req.params.id;
      const comment = req.body.comment;

      console.log(productId);
      console.log(comment);

      const result = await productCollection.updateOne(
        { _id: ObjectId(productId) },
        { $push: { comments: comment } }
      );

      console.log(result);

      if (result.modifiedCount !== 1) {
        console.error('Product not found or comment not added');
        res.json({ error: 'Product not found or comment not added' });
        return;
      }

      console.log('Comment added successfully');
      res.json({ message: 'Comment added successfully' });
    });

    app.get('/comment/:id', async (req, res) => {
      const productId = req.params.id;


      const result = await productCollection.findOne(
        { _id: ObjectId(productId) },
        { projection: { _id: 0, comments: 1 } }
      );

      if (result) {
        res.json(result);
      } else {
        res.status(404).json({ error: 'Product not found' });
      }
    });

    app.post('/user', async (req, res) => {
      const user = req.body;

      const result = await userCollection.insertOne(user);

      res.send(result);
    });

    app.get('/user/:email', async (req, res) => {
      const email = req.params.email;

      const result = await userCollection.findOne({ email });

      if (result?.email) {
        return res.send({ status: true, data: result });
      }

      res.send({ status: false });
    });
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
  }
}


run().catch((err) => console.log(err));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});