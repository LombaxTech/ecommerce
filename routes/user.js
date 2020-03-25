const express = require('express');
const router = express.Router();

const { signup, signin, signout } = require('../controllers/user');
const { userSignupValidator } = require('../validator/index');

router.post('/signup', userSignupValidator, signup);
router.post('/signin', signin);
router.get('/signout', signout);

// router.get('/', (req, res) => {
//     res.send('user route home')
// });

module.exports = router;