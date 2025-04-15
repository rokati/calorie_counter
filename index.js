const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');

app.use(bodyParser.urlencoded( { extended: true }));
app.use(bodyParser.json());

app.set('view engine', 'ejs');

app.use(session({
    secret: 'secret_key',
}));

const subscireToRoutes = require('./routing/index.js');

app.use(express.static('views'));

subscireToRoutes(app);

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/views/index.html');
});

var server = app.listen(3000, function () {
    console.log('Server running on http://localhost:3000');
});