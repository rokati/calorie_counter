const Schema = require('mongoose').Schema;
const db = require('../config/db');

const User = db.model('User', {
  name: String,
  password: String,
  meals: [{
    _receiptId: { type: Schema.Types.ObjectId, ref: 'Receipt' },
    date: Date,
  }]
});

module.exports = User;