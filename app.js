const express = require('express');
const logger = require('morgan');
const mongoose = require('mongoose');

const apiRouter = require('./routes/api');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Connect to Mongoose and set connection variable
mongoose
  .connect('mongodb://niles/recipes', {
    useUnifiedTopology: true,
    useNewUrlParser: true
  })
  .then(() => console.log('Db connected successfully'))
  .catch(err => {
    console.error('Error connecting db', err.message);
  });

app.use('/api', apiRouter);

module.exports = app;
