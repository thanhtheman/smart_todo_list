const express = require('express');

// init the app and middleware
const app = express();

app.listen(3001, () => {
    console.log('App is listening on port 3001');
});

//routes handler
app.get('/books', (req, res) => {
    res.json({ 'msg': 'Welcome to the API!'});
});
