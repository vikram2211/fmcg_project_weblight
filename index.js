const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const route = require('../fmcg_backend/Routes/route');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/fmcg_db', {
    useNewUrlParser: true
})
    .then(() => {
        console.log("MongoDB connected....enjoy!");
    })
    .catch((err) => {
        console.log(err);
    })

app.use('/', route)

app.listen(3000, () => { console.log("App running on port", 3000); })

