Recipe = require('./recipe.model');
// Handle index actions
exports.index = function (req, res) {
  Recipe.get(function (err, recipes) {
    if (err) {
      res.json({
        status: 'error',
        message: err
      });
    }
    res.json({
      status: 'success',
      message: 'Recipes retrieved successfully',
      data: recipes
    });
  });
};
// Handle create contact actions
exports.new = function (req, res) {
  var recipe = new Recipe();
  recipe.title = req.body.title;
  recipe.ingredients = req.body.ingredients;
  recipe.procedure = req.body.procedure;

  recipe.save(function (err) {
    if (err) {
      res.json({
        status: 'error',
        message: err
      });
    }
    res.json({
      message: 'New recipe created!',
      data: recipe
    });
  });
};
// Handle view contact info
exports.view = function (req, res) {
  Recipe.findById(req.params.id, function (err, recipe) {
    if (err) {
      res.json({
        status: 'error',
        message: err
      });
    }
    res.json({
      message: 'Recipe details loading..',
      data: recipe
    });
  });
};
// Handle update contact info
exports.update = function (req, res) {
  Recipe.findById(req.params.id, function (err, recipe) {
    if (err) {
      res.json({
        status: 'error',
        message: err
      });
    }
    const { title, ingredients, procedure } = req.body;
    recipe.title = title;
    recipe.ingredients = ingredients;
    recipe.procedure = procedure;
    // save the recipe and check for errors
    recipe.save(function (err) {
      if (err) {
        res.json({
          status: 'error',
          message: err
        });
      }
      res.json({
        message: 'Recipe Info updated',
        data: recipe
      });
    });
  });
};
// Handle delete contact
exports.delete = function (req, res) {
  Recipe.remove(
    {
      _id: req.params.id
    },
    function (err, contact) {
      if (err) res.send(err);
      res.json({
        status: 'success',
        message: 'Recipe deleted'
      });
    }
  );
};
