resHelper = require('../helpers/response.helper');
Recipe = require('./recipe.model');

const NOT_FOUND_ONE = 'Recipe not found';
const NOT_FOUND_MANY = 'No recipes found';

exports.list = (req, res) => {
  Recipe.search(
    {
      match_all: {}
    },
    {
      from: req.params.from || 0,
      size: req.params.from || 10
    },
    (err, response) => {
      handleResults(err, response, res);
    }
  );
};

exports.search = (req, res) => {
  const keyword = req.query.q ? `${req.query.q}*`.toLowerCase() : '';

  Recipe.search(
    {
      simple_query_string: {
        query: keyword,
        fields: ['categories', 'title']
      }
    },
    {
      from: req.params.from || 0,
      size: req.params.from || 10
    },
    (err, response) => {
      handleResults(err, response, res);
    }
  );
};

/**
 * @deprecated use list or search
 */
exports.index = (req, res) => {
  Recipe.find({}, (err, recipes) => {
    if (!recipes || !recipes.length) {
      resHelper.handleNotFound(NOT_FOUND_MANY, res);
    }
    if (err) {
      resHelper.handleError(err, res);
    }
    if (recipes.length) {
      return res.json({
        message: 'Recipes retrieved successfully',
        data: recipes
      });
    }
  });
};
exports.reindex = (req, res) => {
  const stream = Recipe.synchronize();
  let count = 0;

  stream.on('data', (err, doc) => {
    count++;
  });
  stream.on('close', () => {
    console.log('indexed ' + count + ' documents!');
    res.status(200).end();
  });
  stream.on('error', err => {
    console.log(err);
  });
};
// Handle create recipe actions
exports.new = (req, res) => {
  var recipe = new Recipe();
  saveRecipe(recipe, req, res);
};
// Handle view contact info
exports.view = (req, res) => {
  Recipe.findById(req.params.id, (err, recipe) => {
    if (!recipe) {
      resHelper.handleNotFound(NOT_FOUND_ONE, res);
    }
    if (err) {
      resHelper.handleError(err, res);
    }
    if (recipe) {
      res.json({
        message: 'Recipe details',
        data: recipe
      });
    }
  });
};
// Handle update contact info
exports.update = (req, res) => {
  Recipe.findById(req.params.id, (err, recipe) => {
    if (!recipe) {
      resHelper.handleNotFound(NOT_FOUND_ONE, res);
    }
    if (err) {
      resHelper.handleError(err, res);
    }
    if (recipe) {
      saveRecipe(recipe, req, res);
    }
  });
};
// Handle delete contact
exports.delete = (req, res) => {
  Recipe.remove(
    {
      _id: req.params.id
    },
    (err, recipe) => {
      if (err) res.send(err);
      res.json({
        status: 'success',
        message: 'Recipe deleted'
      });
    }
  );
};

function saveRecipe(recipe, req, res) {
  const { title, image, categories, ingredients, procedure } = req.body;
  recipe.title = title;
  recipe.image = image;
  recipe.categories = categories;
  recipe.ingredients = ingredients;
  recipe.procedure = procedure;

  recipe.save(err => {
    if (err) {
      resHelper.handleError(err, res);
    }
    let message = recipe.__v ? 'Recipe updated!' : 'New recipe created!';
    res.json({
      message,
      data: recipe
    });
  });
}

function handleResults(err, response, res) {
  if (err) {
    return resHelper.handleError(err, res);
  }
  if (!response || !response.hits.hits.length) {
    return resHelper.handleNotFound(NOT_FOUND_MANY, res);
  }
  if (response.hits.hits.length) {
    return res.json({
      message: 'Recipes retrieved successfully',
      data: {
        total: response.hits.total,
        items: response.hits.hits.map(item => ({
          id: item._id,
          ...item._source
        }))
      }
    });
  }
}
