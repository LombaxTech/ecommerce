const express = require('express');
const router = express.Router();

const { create, productId } = require('../controllers/product');
const { requireSignin, isAuth, isAdmin } = require('../controllers/auth');
const { userById } = require('../controllers/user')

router.post('/product/create/:userId', requireSignin, isAuth, isAdmin, create);

router.param('userId', userById);
router.param('productId', productId)

module.exports = router;