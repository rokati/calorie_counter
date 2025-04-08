const Schema = require('mongoose').Schema;
const db = require('../config/db');

const Ingredient = db.model('Ingredient', {
  name: String,
  carbs: Number,
  protein: Number,
  fat: Number
});

module.exports = Ingredient;