const express = require('express');
const router = express.Router();

const { signup, signin } = require('../controllers/user');
const { userSignupValidator } = require('../validator/index');

router.post('/signup', userSignupValidator, signup);
router.post('/signin', signin);

// router.get('/', (req, res) => {
//     res.send('user route home')
// });

module.exports = router;