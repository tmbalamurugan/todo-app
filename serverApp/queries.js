var Q = require('q');
var Rx = require('rx-lite');
var db = require('./schema.js/index')
console.log('db === ',db)
var document = function () {}

module.exports = document

document.findOne = function(model, query, cb){
    db[model].findOne(query).exec(function(err, doc){
        if(err){
            cb(err, null)
            return;
        } else {
            cb(null, doc)
        }
    });
}
document.findOnePromise = Q.denodeify(document.findOne);

document.save = function(model, query, cb){

    db[model].create(query, function(err, doc){
        if(err){
            cb(err, null)
        } else {
            cb(null, doc)
        }
    });
}

document.savePromise = Q.denodeify(document.save);


document.find = function(model, query, cb){
    console.log('query',query);

    db[model].find(query).exec(function(err, docs){
        console.log(err);
        console.log(docs);

        if(err){
            cb(err, null)
        } else {
            cb(null, docs)
        }
    });
}

document.findPromise = Q.denodeify(document.find);


document.aggregation = function(model, query, cb){
console.log('query',query)
    db[model].aggregate(query).exec(function(err, docs){
        console.log(err);
        console.log('docs=======',docs);

        if(err){
            cb(err, null)
        } else {
            cb(null, docs)
        }
    });
}

document.aggregationPromise = Q.denodeify(document.aggregation);


