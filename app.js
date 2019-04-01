const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require ('mongoose');

app.use((req,res,next) => {
    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Headers',"Origin,X-Requested-With,Content-Type,Accept,Authorization");
if(req.method === 'OPTIONS'){
    res.header('Access-Cotrol-Allow-Methods','PUT,POST,PATCH,DELETE,GET');
    return res.status(200).json({});
}
next();
});
const bookRoutes = require('./api/routes/books');
const lendingRoutes = require('./api/routes/lending');

mongoose.connect(
    "mongodb+srv://node-book:"+
    process.env.MONGO_ATLAS_PW+
    "@node-rest-books-5akh9.mongodb.net/test?retryWrites=true",{ useNewUrlParser: true });
mongoose.Promise = global.Promise;
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
// Routes which handle requests
app.use('/books',bookRoutes);
app.use('/lending',lendingRoutes);

app.use((req,res,next) => {
    const error = new Error('Not found');
    error.status=404;
    next(error);
})

app.use((error,req,res,next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message:error.status
        }
    });
});
module.exports = app;