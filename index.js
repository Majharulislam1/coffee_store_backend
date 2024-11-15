const express = require('express')
const app = express()
const port = 3000
const cors = require('cors');

app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = "mongodb+srv://habluthegreat535:A4nOWRXpmzqg0DGZ@cluster0.ccupl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });

app.get('/', (req, res) => {
  res.send('Hello World!')
})




 


async function run() {
  try {
     
    await client.connect();

    const database = client.db("CoffeeBD");
    const coffee  = database.collection("coffee");

    app.post('/coffee',async(req,res)=>{
          const data = req.body;
          const result = await coffee.insertOne(data);
          res.send(result);
    })

    app.get('/coffee',async(req,res)=>{
        const cursor = coffee.find();
        const result = await cursor.toArray();
        res.send(result);
           
    })

    app.get('/coffee/:id',async(req,res)=>{
         const id = req.params.id;
         const query = { _id:new ObjectId(id)};
         const  data = await coffee.findOne(query);
         res.send(data);
    })

    app.put('/coffee/:id',async(req,res)=>{
        const id = req.params.id;
        const  data = req.body;
        const options = { upsert: true };
        const query = { _id:new ObjectId(id)};

        const updateDoc = {
            $set: {
                coffeeName:data.coffeeName,
                chef:data.chef,
                price:data.price
                 
            },
          };

        const result = await coffee.updateOne(query, updateDoc, options);

        res.send(result);


    })


    app.delete('/coffee/:id',async(req,res)=>{
        const id = req.params.id;
        const query = { _id:new ObjectId(id)};
        const result = await coffee.deleteOne(query);
        res.send(result);

    })


     
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    
    // await client.close();
  }
}
run().catch(console.dir);


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})