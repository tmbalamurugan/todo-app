const express = require('express');
const app = express();
const path = require('path');
var http = require('http')
// Run the app by serving the static files
// in the dist directory
app.use(express.static(__dirname + '/dist'));
// Start the app by listening on the default
// Heroku port

app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, '/dist/crud/index.html'));
});

http.createServer(app, function(req, res){
    res.writeHeader(200, {"Content-Type": "text/html"});  
    res.write(html);  
    res.end();  
}).listen(process.env.PORT || 8080)