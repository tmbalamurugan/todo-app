var mongodb = require('../queries')
var Rx = require('rx-lite');
var isEmpty = require('is-empty');
var express = require('express');
var app = express.Router();
const mongoose = require('mongoose');

module.exports = app;

app.saveTodo = function (req, res) {
    console.log("req.body ==== ",req.body);
    Rx.Observable.fromPromise(mongodb.savePromise("todo", req.body)).map(function (document) {
        console.log('document = ', document);
        if (isEmpty(document)) {
            Rx.Observable.of({})
        } else {
            return document;
        }
    }).subscribe(function (result) {
        res.status(200).json({ "data": result, });
    }, function (error) {
        console.log('error = ', error);
        res.status(500).json({ "error": error })
    }, function () {
        console.info("Successfully login")
    })
}

app.listTodo = function (req, res) {
    if (req.body.id) {
        Rx.Observable.fromPromise(mongodb.findPromise("todo", {"createdBy": mongoose.Types.ObjectId(req.body.id)})).map(function (document) {
            if (isEmpty(document)) {
                Rx.Observable.of({})
            } else {
                return document;
            }
        }).subscribe(function (result) {
            res.status(200).json({ "data": result });
        }, function (error) {
            console.log('error = ', error);
            res.status(500).json({ "error": error })
        }, function () {
            console.info("Successfully login")
        })
    } else {
        res.status(500).json({ "error": "user id not found" })
    }

}