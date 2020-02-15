const express = require('express');
const app = express();
const path = require('path');
const http = require('http')
const logger = require('morgan');
const bodyParser = require('body-parser');
const routes = require('./serverApp/routes/index');
const authRoutes = require('./serverApp/routes/auth');
const mongoose = require('mongoose');
var cors = require("cors");
if (app.get('env') === 'production') {
    app.use(logger('combined'));
} else {
    app.use(logger('dev'));
}


mongoose.connect("", { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    console.log('MongoDB connected')
}).catch((err) => {
    console.log('MongoDB err ', err);
});


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// Run the app by serving the static files
// in the dist directory
app.use(express.static(__dirname + '/dist/crud'));
// app.use(express.static(__dirname + '/src'));

// Start the app by listening on the default
// Heroku port
app.use(cors());
app.get('/*', function (req, res) {
    console.log('==================')
    res.sendFile(path.join(__dirname, '/dist/crud/index.html'));
    // res.sendFile(path.join(__dirname, '/src/index.html'));

});

app.use('/api', routes)
app.use('/auth', authRoutes)


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

http.createServer(app, function (req, res) {
    res.writeHeader(200, { "Content-Type": "text/html" });
    res.write(html);
    res.end();
}).listen(process.env.PORT || 8080)
