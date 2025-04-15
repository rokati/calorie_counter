const Schema = require('mongoose').Schema;
const db = require('../config/db');

const User = db.model('User', {
  username: String,
  password: String,
  goal_calories: Number,
  consumed_calories: Number,
  consumed_carbs: Number,
  consumed_proteins: Number,
  consumed_fats: Number,
  meals: [{
    _receiptId: { type: Schema.Types.ObjectId, ref: 'Receipt' },
    date: Date,
  }]
});

module.exports = User;