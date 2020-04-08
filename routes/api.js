const router = require('express').Router();
const recipeController = require('../recipes/recipe.controller');
// Set default API response
router.get('/', function (req, res) {
  res.json({
    status: 'API Its Working',
    message: 'Welcome to API, crafted with love!'
  });
});
// Recipes Routes
router.route('/recipes').get(recipeController.index).post(recipeController.new);
router
  .route('/recipes/:id')
  .get(recipeController.view)
  .patch(recipeController.update)
  .put(recipeController.update)
  .delete(recipeController.delete);

module.exports = router;
