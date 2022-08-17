const { ObjectId } = require('bson');
const express = require('express');
const { connectToDb, getDb } = require('./database/db')

//init express and middleware
const app = express();
app.use(express.json());



//get connected to MongoDB
let db;
connectToDb((error) => {
    if (!error) {
        app.listen(3001, () => {
            console.log('App is listening on port 3001');
        });
        db = getDb()
    } else {
        console.log("Database Connection Failed!")
    }
});


//routes

app.get('/books', (req, res) => {
    //pagination
    const page = req.query.p || 0;
    const booksPerPage = 3
    
    
    
    let books =[]
    // "find" returns a cursor (not a whole collection like Mongo Compass) that points to our items on the database - toArray or forEach
    db.collection('books')
        .find()
        .sort({ author: 1 })
        .skip(page * booksPerPage)
        .limit(booksPerPage)
        .forEach( book => books.push(book) )
        .then(() => {
            res.status(200).json(books)
        })
        .catch(() => {
            res.status(500).json( {error: 'could not fetch data'})
        })
});

app.get('/books/:id', (req, res) => {
    if (ObjectId.isValid(req.params.id)) {
        db.collection('books')
        .findOne({_id: ObjectId(req.params.id)})
        .then(doc => {res.status(200).json(doc)}).
        catch(error => {res.status(500).json({msg: 'could not get data'})})
    } else {
        res.status(500).json({ error: "Not valid ID"})
    }
});

app.post('/books', (req, res) => {
    const book = req.body
    db.collection('books')
        .insertMany(book)
        .then(result => {
            res.status(201).json(result)
        })
        .catch(error => {
            res.status(500).json({ error: 'Could not create a document'})
        })  
});

app.delete('/books/:id', (req, res) => {
    if (ObjectId.isValid(req.params.id)) {
        db.collection('books')
        .deleteOne({_id: ObjectId(req.params.id)})
        .then(result => {res.status(200).json(result)}).
        catch(error => {res.status(500).json({msg: 'could not delete data'})})
    } else {
        res.status(500).json({ error: "Not valid ID"})
    }
});

app.patch('/books/:id', (req, res) => {
    const update = req.body;

    if (ObjectId.isValid(req.params.id)) {
        db.collection('books')
        .updateOne({_id: ObjectId(req.params.id)}, 
        {$set: update})
        .then(result => {res.status(200).json(result)})
        .catch(error => {res.status(500).json({msg: 'could not update data'})})
    } else {
        res.status(500).json({ error: "Not valid ID"})
    }
});