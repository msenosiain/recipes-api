const router = require('express').Router();

const recipeController = require('../recipes/recipe.controller');
const imagesController = require('../images/images.controller');

// Set default API response
router.get('/', (req, res) => {
  res.json({
    status: 'API Its Working',
    message: 'Welcome to API, crafted with love!'
  });
});

// Recipes Routes
router
  .route('/recipes')
  .get(recipeController.list)
  .post(recipeController.new)
  .patch(recipeController.reindex);
router.route('/recipes/search').get(recipeController.search);
router
  .route('/recipes/:id')
  .get(recipeController.view)
  .patch(recipeController.update)
  .put(recipeController.update)
  .delete(recipeController.delete);

// Images Routes
router
  .route('/images')
  .post(
    imagesController.upload.single('image'),
    imagesController.processUpload
  );
router.route('/images/:filename').get(imagesController.view);

module.exports = router;
