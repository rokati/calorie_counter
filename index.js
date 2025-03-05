var express = require('express');
var app = express();

app.use(express.static('static'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/login.html');
});

var server = app.listen(3000, function () {
    console.log('Server running at http://localhost:3000');
});