// 2 functions: connecting to the database, retrieving data from MongoDB
const { MongoClient } = require('mongodb');

let dbConnection;

// we have a callback function that will fire after the connection is successful or failed.
// In the App, we will use this callback as a condition check, so we only listening to port 3001
// if the database connection is successful.
const connectToDb = async (cb) => {
    try {
        const client = await MongoClient.connect('mongodb://localhost:27017/bookstore')
        dbConnection = client.db(); 
        return cb();
    } catch (error) {
        console.log(error);
        return cb(error);
    }
}

const getDb =  () => dbConnection

module.exports = { connectToDb, getDb}