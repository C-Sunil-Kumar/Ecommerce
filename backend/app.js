const express = require('express');
const errorMiddeware = require('./middlewares/error');
const app = express();
const cookieParser = require('cookie-parser');

// Tell Express to use the 'qs' library for query string parsing
app.set('query parser', 'extended');
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

const products = require('./routes/product');
const auth = require('./routes/auth');
const order = require('./routes/order');

app.use('/api/v1', products);
app.use('/api/v1', auth);
app.use('/api/v1', order);
app.use(errorMiddeware);


module.exports = app;
