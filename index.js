const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
require('dotenv').config()
const ObjectId = require('mongodb').ObjectId
const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hlvdh.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`

const port = process.env.PORT || 5055

const app = express()
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))



const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err =>{
    
    const productsCollection = client.db("stockRoom").collection("products");
    const addedProductsCollection = client.db("stockRoom").collection("addedProducts");
    
    // add product by user
    app.get('/checkout/:id', (req, res) =>{
        productsCollection.find({_id:ObjectId(req.params.id)})
            .toArray((err, documents) =>{
                res.send(documents[0]);
            })
    })


    // product ordered after clicked on checkout button   
     app.post('/addedProduct', (req, res) =>{
        const addedProduct = req.body
        addedProductsCollection.insertOne(addedProduct)
        .then(result => {
            console.log(result.insertedCount)
            res.send(result.insertedCount > 0)
        })
     })
    
    
    // get ordered products
    app.get('/orderedProduct/:email', (req, res) =>{
        addedProductsCollection.find({ email: req.params.email })
            .toArray((err, documents) =>{
                res.send(documents)
            })
    })

    // show products in ui home page
    app.get('/products', (req, res) =>{
        productsCollection.find()
        .toArray((err, items)=>{
            res.send(items)
        })
    })

    // products added by admin
    app.post('/addProducts', (req, res) =>{
        const newProducts = req.body
        productsCollection.insertOne(newProducts)
        .then(result => {
            console.log(result.insertedCount)
            res.send(result.insertedCount > 0)
        })
    })

    app.get('/', (req, res) =>
    {
        res.send("hey i'm stockroom server talking")
    })

});




app.listen(port, () =>{
    console.log("Example")
})
