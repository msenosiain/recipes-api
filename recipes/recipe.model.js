const mongoose = require('mongoose');
const mongoosastic = require('mongoosastic');

const ingredientSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    quantity: Number,
    unit: String
  },
  { _id: false }
);

const recipeSchema = mongoose.Schema(
  {
    categories: { type: [String], required: true },
    title: { type: String, required: true },
    ingredients: { type: [ingredientSchema], required: true },
    procedure: { type: String, required: true }
  },
  { timestamps: true }
);

recipeSchema.plugin(mongoosastic, {
  host: 'niles',
  port: 9200
});

const Recipe = mongoose.model('recipe', recipeSchema);

Recipe.createMapping((err, mapping) => {
  console.log('recipe mapping created');
});

module.exports = Recipe;
