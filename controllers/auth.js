const User = require('../models/user');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');

const { errorHandler } = require('../helpers/dbErrorHandler');

exports.signup = (req, res) => {
    console.log(req.body);
    const user = new User(req.body);
    user.save()
        .then(() => res.json({ user }))
        .catch(err => res.status(400).json({
            error: errorHandler(err)
        }))
}

exports.signin = (req, res) => {
    const { email, password } = req.body;
    User.findOne({ email }, (err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: 'user of that email doesnt exist'
            })
        }

        if (!user.authenticate(password)) {
            return res.status(401).json({
                error: 'email and password dont match'
            })
        }
        // if user is found then:
        // create auth method 

        // create token
        const token = jwt.sign({ _id: user._id }, 'sjsiojsio');
        res.cookie('t', token, { expire: new Date() + 9999 });
        const { _id, name, email, role } = user;
        return res.json({
            token,
            user: { _id, email, name, role }
        });

    });
}

exports.signout = (req, res) => {
    res.clearCookie('t');
    res.json({ message: 'signout successful' });
}

exports.requireSignin = expressJwt({
    secret: 'sjsiojsio',
    userProperty: 'auth'
})

exports.isAuth = (req, res, next) => {
    let user = req.profile && req.auth && req.profile._id == req.auth._id

    if (!user) {
        return res.status(403).json({
            error: 'access denied'
        });
    }

    next();
}

exports.isAdmin = (req, res, next) => {
    if (req.profile.role === 0) {
        return res.status(403).json({
            error: 'admin only'
        });
    }

    next();
}