var fs = require('fs');
var db = require('seraph')('http://localhost:10507');
var beer = require('../models/beer')(db);
var beerjson = require('beerjson');

exports.recipe = function(req, res) {
  fs.readFile('./recipes/' + req.params.recipe + '.json', 'utf8', 
  function(err, data) {
    if (err) return res.end(500);
    var recipe = JSON.parse(data);
    recipe.require = require;
    res.render('index', recipe);
  });
}

function readBeerXmlFromRequest(req,res, next) {
  var beerXml = '';
  req.on('data', function(ch) { beerXml += ch });
  req.on('end', function() {
    beerjson.fromBeerXml(beerXml, function(err, recipe) {
      if (err) return res.send(500, err.message);
      else return next(recipe);
    })
  });
};

exports.importBeerXml = function(req, res) {
  readBeerXmlFromRequest(req, res, function(recipe) {
    beer.save(recipe, function(err, savedRecipe) {
      console.log(savedRecipe);
      if (err) {
        if (err.statusCode) {
          res.send(err.statusCode, err.message);
        } else {
          res.send(500, err.message);
        }
        return;
      }

      res.json(201, savedRecipe);
    });
  });
};

exports.getRecipeJson = function(req, res) {
  beer.firstWithSlug(req.params.slug, function(err, recipe) {
    if (err) return res.send(err.statusCode || 500, err.message || err);
    res.json(recipe);
  });
}

exports.replaceRecipe = function(req, res) {
  readBeerXmlFromRequest(req, res, function(recipe) {
    beer.firstWithSlug(req.params.slug, function(err, oldRecipe) {
      if (err) return res.send(err.statusCode || 500, err.message || err);
      db.delete(oldRecipe, true, function(err) {
        if (err) return res.send(err.statusCode || 500, err.message || err);
        beer.save(recipe, function(err, recipe) {
          if (err) return res.send(err.statusCode || 500, err.message || err);
          res.json(recipe);
        });
      });
    });
  });
};

exports.readRecipe = function(req, res) {
  beer.firstWithSlug(req.params.slug, function(err, recipe) {
    if (err) return res.send(err.statusCode || 500, err.message || err);
    recipe.require = require;
    res.render('index', recipe);
  });
};

exports.deleteRecipe = function(req, res) {
  beer.firstWithSlug(req.params.slug, function(err, recipe) {
    if (err) return res.send(err.statusCode || 500, err.message || err);
    db.delete(recipe, true, function(err) {
      if (err) return res.send(err.statusCode || 500, err.message || err);
      res.send(200);
    })
  });
};
