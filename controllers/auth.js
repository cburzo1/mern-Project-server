const { validationResult } = require('express-validator');
const Post = require("../models/post");
const User = require("../models/user");
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const JWT = require('jsonwebtoken');

exports.signup = (req, res, next) =>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        const error = new Error('Validation Failed.');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;
    bcrypt.hash(password, 12)
        .then(hashedPassword => {
            const user = new User({
                email: email,
                password: hashedPassword,
                username: username
            });
            return user.save();
        })
        .then(result => {
            res.status(201).json({
                message: "User created", 
                userId: result._id
            })
        })
        .catch(err => {
            if(!err.statusCode){
                err.statusCode = 500;
            }
            next(err);
        })
}

exports.login = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    let loadedUser;
    User
    .findOne({email: email})
    .then(user => {
        if(!user) {
            const error = new Error('A user with this email could not be found');
            error.statusCode = 401;
            throw error;
        }
        loadedUser = user;
        return bcrypt.compare(password, user.password);
    })
    .then(isEqual => {
        if(!isEqual){
            const error = new Error('Wrong Password');
            error.statusCode = 401;
            throw error;
        }
        const token = JWT.sign({
            email: loadedUser.email,
            userId: loadedUser._id.toString()
        }, 
        'secret', 
        {expiresIn: '1h'}
        );
        res.status(200).json({token: token, userId: loadedUser._id.toString()})
    })
    .catch(err => {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    });
}