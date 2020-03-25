const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const expressValidator = require('express-validator');

const app = express();

mongoose.connect('mongodb://testuser:testuser123@ds117334.mlab.com:17334/ecommerce', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('connected to db'))
    .catch(err => console.log(err))

// * Middleware
app.use(morgan('dev'));
app.use(express.json()); //Used to parse JSON bodies
app.use(cookieParser());
app.use(expressValidator());

// * Routes
const userRoutes = require('./routes/user');

// * Route middleware
app.use('/api', userRoutes);

app.get('/', (req, res) => {
    res.send('homepage');
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, console.log('started listening'));