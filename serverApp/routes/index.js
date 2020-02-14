var express = require('express');
var app = express.Router();
var jwt = require('jsonwebtoken');
var config = require('../config');

var todoAppAction = require('./todo')

module.exports = app;


app.use(function (req, res, next) {
    console.log("req.body = ", req.body);
    var token = req.headers['x-access-token'] || req.headers["authorization"];
    console.log('token === ',token)
    if (!token) {
        return res.status(403).json({ auth: false, message: 'No token provided.' });
    } else {
        if (token.startsWith('Bearer ')) {
            // Remove Bearer from string
            token = token.slice(7, token.length);
          }
        jwt.verify(token, config.secret, function (err, decoded) {
            if (err)
                return res.status(500).json({ auth: false, message: 'Failed to authenticate token.' });
    
            // if everything good, save to request for use in other routes
            req.userId = decoded.id;
            next();
        });
    }
});

app.post('/todo/save', todoAppAction.saveTodo);
app.post('/todo/list', todoAppAction.listTodo);
