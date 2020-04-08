const express = require('express');
const logger = require('morgan');
const mongoose = require('mongoose');

const indexRouter = require('./routes/index');
const apiRouter = require('./routes/api');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Connect to Mongoose and set connection variable
mongoose.connect('mongodb://niles/recipes', { useNewUrlParser: true });
var db = mongoose.connection;

// Added check for DB connection
if (!db) console.log('Error connecting db');
else console.log('Db connected successfully');

app.use('/', indexRouter);
app.use('/api', apiRouter);

module.exports = app;
