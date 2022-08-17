const express = require('express');
const { connectToDb, getDb } = require('./database/db')

//init express and middleware
const app = express();



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
    let books =[]
    // "find" returns a cursor (not a whole collection like Mongo Compass) that points to our items on the database - toArray or forEach
    db.collection('books')
        .find()
        .sort({ author: 1 })
        .forEach( book => books.push(book) )
        .then(() => {
            res.status(200).json(books)
        })
        .catch(() => {
            res.status(500).json( {error: 'could not fetch data'})
        })
});