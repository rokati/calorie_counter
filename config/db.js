const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/hbvvt3', { useNewUrlParser: true });

module.exports = mongoose;