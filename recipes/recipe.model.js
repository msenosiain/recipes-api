const mongoose = require('mongoose');
const mongoosastic = require('mongoosastic');

require('dotenv').config();

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
    categories: { type: [String], required: true, es_indexed: true },
    title: { type: String, required: true, es_indexed: true },
    ingredients: {
      type: [ingredientSchema],
      required: true,
      es_indexed: false
    },
    procedure: { type: String, required: true },
    image: String
  },
  { timestamps: true }
);

recipeSchema.plugin(mongoosastic, {
  host: process.env.ELASTISEARCH_HOST,
  port: process.env.ELASTISEARCH_HOST_PORT
});

const Recipe = mongoose.model('recipe', recipeSchema);

// Recipe.createMapping((err, mapping) => {
//   console.log('recipe mapping created');
// });

module.exports = Recipe;
