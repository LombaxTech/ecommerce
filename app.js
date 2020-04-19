const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const expressValidator = require('express-validator');
const cors = require('cors');

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
app.use(cors());

// * Routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const categoryRoutes = require('./routes/category');
const productRoutes = require('./routes/product');

// * Route middleware
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', categoryRoutes);
app.use('/api', productRoutes);

app.get('/', (req, res) => {
    res.send('homepage');
})

const PORT = process.env.PORT || 8000;
app.listen(PORT, console.log('started listening'));