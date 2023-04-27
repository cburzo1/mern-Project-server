const { validationResult } = require('express-validator');
const Post = require("../models/post");
const User = require("../models/user");
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const JWT = require('jsonwebtoken');
const { now } = require('mongoose');
const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: "gm.c.burzo@gmail.com", // generated ethereal user
      pass: "xnmytfcuxhqgniyu", // generated ethereal password
    },
  });

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
            console.log(email);
            return transporter.sendMail({
                from: '"Fred Foo 👻" <foo@example.com>', // sender address
                to: email, // list of receivers
                subject: "Hello ✔", // Subject line
                text: "Hello world?", // plain text body
                html: "<b>ANOTHER BLOOMING APP!!!</b>", // html body
              });
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
        {
            expiresIn: '10m'
        });

        res.status(200).json({
            token: token, 
            userId: loadedUser._id.toString(),
            expiresIn: 600
        })
    })
    .catch(err => {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    });
}

exports.forgotPassword = (req, res, next) => {
    const email = req.body.email;
    let loadedUser;
    User.findOne({email: email})
    .then(user => {
        if(!user) {
            const error = new Error('A user with this email could not be found');
            error.statusCode = 401;
            throw error;
        }
        loadedUser = user;
        //console.log(loadedUser);
        const token = JWT.sign({
            email: loadedUser.email,
            userId: loadedUser._id.toString()
        }, 
        'secret###', 
        {
            expiresIn: '10m'
        });

        transporter.sendMail({
            from: '"Fred Foo 👻" <foo@example.com>', // sender address
            to: email, // list of receivers
            subject: "Hello ✔", // Subject line
            text: "Password Reset", // plain text body
            html: `<b>If you did not request a password reset please truncate this email</b>
            <p>If you did request the password reset please click the link:</p>
            <a href="http://localhost:3000/recreatePassword">link to reset</a>`, // html body
          });
          res.status(200).json({
            token: token, 
            userId: loadedUser._id.toString(),
            expiresIn: 600
        })
    })
    .catch(err => {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    });
};

exports.resetPassword = (req, res, next) => {

}