var express = require('express');
var app = express();

const subscireToRoutes = require('./routing/index.js');

app.use(express.static('views'));

subscireToRoutes(app);

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/views/index.html');
});

var server = app.listen(3000, function () {
    console.log('Server running on http://localhost:3000');
});