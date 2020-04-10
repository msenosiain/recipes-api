Recipe = require('./recipe.model');
// Handle index actions
exports.index = function (req, res, next) {
  Recipe.find({}, function (err, recipes) {
    handleNotFound(recipes, res, next);
    handleError(err, res);
    if (recipes.length) {
      res.json({
        message: 'Recipes retrieved successfully',
        data: recipes
      });
    }
  });
};
// Handle create recipe actions
exports.new = function (req, res) {
  var recipe = new Recipe();
  saveRecipe(recipe, req, res);
};
// Handle view contact info
exports.view = function (req, res) {
  Recipe.findById(req.params.id, function (err, recipe) {
    handleNotFound(recipe, res);
    handleError(err, res);
    if (recipe) {
      res.json({
        message: 'Recipe details',
        data: recipe
      });
    }
  });
};
// Handle update contact info
exports.update = function (req, res) {
  Recipe.findById(req.params.id, function (err, recipe) {
    handleNotFound(recipe, res);
    handleError(err, res);
    if (recipe) {
      saveRecipe(recipe, req, res);
    }
  });
};
// Handle delete contact
exports.delete = function (req, res) {
  Recipe.remove(
    {
      _id: req.params.id
    },
    function (err, recipe) {
      if (err) res.send(err);
      res.json({
        status: 'success',
        message: 'Recipe deleted'
      });
    }
  );
};

function saveRecipe(recipe, req, res) {
  const { categories, title, ingredients, procedure } = req.body;
  recipe.categories = categories;
  recipe.title = title;
  recipe.ingredients = ingredients;
  recipe.procedure = procedure;

  recipe.save(err => {
    handleError(err);
    let message = recipe._v ? 'Recipe updated!' : 'New recipe created!';
    res.json({
      message,
      data: recipe
    });
  });
}

function handleNotFound(item, res, next) {
  if (!item || !item.length) {
    res.status(404).json({
      status: 'error',
      message: 'Recipe not found'
    });
  }
}

function handleError(err, res) {
  if (err) {
    switch (err.name) {
      case 'ValidationError':
        res.status(400);
        break;
      default:
        res.status(500);
        break;
    }
    res.json({
      error: err.message,
      response: err
    });
  }
}
