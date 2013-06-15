var Model = require('seraph-model');
var slug = require('slug');
module.exports = function(db) {
  var beer = Model(db, 'beer');
  var hop = Model(db, 'hop');
  var fermentable = Model(db, 'fermentable');
  var addition = Model(db, 'addition');
  var yeast = Model(db, 'yeast');
  var mashStep = Model(db, 'mash_step');

  beer.compose(hop, 'hops', 'contains_hop', true);
  beer.compose(fermentable, 'fermentables', 'contains_fermentable', true);
  beer.compose(addition, 'additions', 'contains_addition', true);
  beer.compose(yeast, 'yeast', 'contains_yeast');
  beer.compose(mashStep, 'mash', 'has_mash_step', true);

  beer.on('prepare', function addSlug(recipe, cb) {
    var nameslug = slug(recipe.name).toLowerCase();
    var cypher = 'START n='+beer.cypherStart()+' WHERE has(n.slug) AND ';
    cypher += 'n.slug =~ "' + nameslug + '.*" RETURN count(n) AS count';
    db.query(cypher, function(err, res) {
      if (err) return cb(err);
      var slugCount = res[0];
      if (slugCount > 0) nameslug = nameslug + '-' + slugCount;
      recipe.slug = nameslug;
      cb(null, recipe);
    });
  });

  beer.firstWithSlug = function(slug, cb) {
    var cypher = 'START n=' + beer.cypherStart() + ' WHERE has(n.slug) ' +
      'AND n.slug = {slug} RETURN n';
  
    db.query(cypher, {slug:slug}, function(err, recipe) {
      if (err) return cb(err);
      if (!recipe || recipe.length == 0) 
        return cb({statusCode:404,message:'Not found'});
      beer.read(recipe[0], cb);
    });
  };

  return beer;
};
