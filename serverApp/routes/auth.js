var express = require('express');
var app = express.Router();
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var Rx = require('rx-lite');
var mongodb = require('../queries')
var isEmpty = require('is-empty');
var config = require('../config')

app.post('/login', function (req, res) {
    console.log('req.body ', req.body);
    let username = req.body.username;
    let password = req.body.password;
    var token = ""

    Rx.Observable.fromPromise(mongodb.findOnePromise("user", { "username": req.body.username })).map(function (document) {
        console.log('document = ', document);
        if (isEmpty(document)) {
            Rx.Observable.of({})
        } else {
            token = jwt.sign({ username: username },
                config.secret,
                {
                    expiresIn: '24h' // expires in 24 hours
                }
            );
            if (document.username == username && bcrypt.compareSync(password, document.password)) {
                return document;
            } else {
                Rx.Observable.of({})
            }
        }
    }).subscribe(function (result) {
        if (isEmpty(result)) {
            res.status(404).json({ "data": "user not exist" });
        } else {
            res.status(200).json({ "data": result, "token": token });
        }
    }, function (error) {
        console.log('error = ', error);
        res.status(500).json({ "error": error })
    }, function () {
        console.info("Successfully login")
    })
});
app.post('/register', function (req, res) {
    console.log('req.body ', req.body)
    let hashedPassword = bcrypt.hashSync(req.body.password, 8);
    var newUser = {
        username: req.body.username,
        password: hashedPassword
    }
    var token = ""
    Rx.Observable.fromPromise(mongodb.findOnePromise("user", { "username": req.body.username })).map(function (user) {
        if (isEmpty(user)) {
            token = jwt.sign({ username: newUser.username },
                config.secret,
                {
                    expiresIn: '24h' // expires in 24 hours
                }
            );
            console.log('username', newUser)
            return mongodb.savePromise("user", newUser)
        } else {
            Rx.Observable.of({})
        }
    }).subscribe(function (result) {
        if (isEmpty(result)) {
            res.status(302).json({ "data": "user already exist" });
        } else {
            res.status(200).json({ "data": result, "token": token });
        }
    }, function (error) {
        console.log('error = ', error);
        res.status(500).json({ "error": error })
    }, function () {
        console.info("Successfully login")
    })
});

module.exports = app;