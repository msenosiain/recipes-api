const mongoose = require('mongoose');
const mongoosastic = require('mongoosastic');

const recipeSchema = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  ingredients: [
    {
      name: String,
      quantity: Number,
      unit: { type: String, enum: ['g', 'kg', 'l', 'ml'] }
    }
  ],
  procedure: {
    type: String,
    required: true
  },
  create_date: {
    type: Date,
    default: Date.now
  }
});

recipeSchema.plugin(mongoosastic, {
  host: 'niles',
  port: 9200
});

const Recipe = mongoose.model('recipe', recipeSchema);

Recipe.createMapping((err, mapping) => {
  console.log('recipe mapping created');
});

module.exports = Recipe;
module.exports.get = function (callback, limit) {
  Recipe.find(callback).limit(limit);
};
