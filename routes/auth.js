const express = require('express');
const userFeedController = require('../controllers/userFeed');
const router = express.Router();
const { body } = require('express-validator');
const User = require('../models/user');
const authController = require('../controllers/auth');
const isReadyReset = require('../middleware/is-pwReset');

router.post('/signup', [
    body('email')
        .isEmail()
        .withMessage("Please Enter a valid email")
        .custom((value, {req}) => {
            return User.findOne({email: value})
            .then(userDoc => {
                if(userDoc){
                    return Promise.reject('Email address already exists');
                }
            });
        })
        .normalizeEmail(),
    body('password')
        .trim()
        .isLength({min: 5}),
    body('username')
        .trim()
        .not()
        .isEmpty()
], authController.signup);

router.post('/login', authController.login);

router.post('/forgotPassword',[
    body('email')
        .isEmail()
        .withMessage("Please Enter a valid email")
        .custom((value, {req}) => {
            return User.findOne({email: value})
            .then(userDoc => {
                if(userDoc){
                    return Promise.reject('Email address already exists');
                }
            });
        })
        .normalizeEmail()
], authController.resetPassword);

router.get('/recreatePassword', isReadyReset);

module.exports = router;