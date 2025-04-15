const Schema = require('mongoose').Schema;
const db = require('../config/db');

const Receipt = db.model('Receipt', {
  name: String,
  ingredients: [{
    _ingredientId: { type: Schema.Types.ObjectId, ref: 'Ingredient' },
    amount: Number,
  }],
  calories: Number,
});

module.exports = Receipt;