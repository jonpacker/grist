
/*
 * GET home page.
 */
var fs = require('fs');

exports.recipe = function(req, res) {
  fs.readFile('./recipes/' + req.params.recipe + '.json', 'utf8', 
  function(err, data) {
    if (err) return res.end(500);
    var recipe = JSON.parse(data);
    recipe.require = require;
    res.render('index', recipe);
  });
}

exports.index = function(req, res){
  res.render('index', {
    require:require,
  "name": "Hvetevasket",
  "style": "White IPA",
  "brewer": "Monadic Ale",
  "units": "metric",
  "batchSize": 19.084,
  "boilSize": 23.224,
  "boilTime": 90,
  "efficiency": 0.7,
  "og": 1.064,
  "fg": 1.015,
  "abv": 0.063,
  "ibu": 85,
  "color": 5,
  "fermentables": {
    "Pale Malt (2 Row)": 2.3,
    "Weyermann - Pale Wheat Malt": 2.3,
    "Wheat, Torrified": 0.5,
    "Oats, Flaked": 0.5
  },
  "hops": [
    { "name": "Cascade",
      "aa": 0.07,
      "amount": 65,
      "use": "boil",
      "time": 90 },
    { "name": "Cascade",
      "aa": 0.07,
      "amount": 50,
      "use": "boil",
      "time": 15 },
    { "name": "Cascade",
      "aa": 0.07,
      "amount": 85,
      "use": "boil",
      "time": 5 },
    { "name": "Cascade",
      "aa": 0.07,
      "amount": 100,
      "use": "aroma steep",
      "time": 10 },
    { "name": "Cascade",
      "aa": 0.07,
      "amount": 100,
      "use": "dry hop",
      "time": "11 days" },
    { "name": "Cascade",
      "aa": 0.07,
      "amount": 100,
      "use": "dry hop",
      "time": "5 days" }
  ],
  "additions": [
    { "name": "Grapefruit Zest",
      "use": "boil",
      "time": 1,
      "amount": "30g" },
    { "name": "Coriander Seeds",
      "use": "boil",
      "time": 1,
      "amount": "30g" }
  ],
  "yeast": {
    "name": "Belgian Wit Ale",
    "code": "WLP400",
    "amount": "1 vial"
  },
  "mash": [
    { "name": "Saccharification Rest",
      "type": "Infusion",
      "amount": 23.5,
      "infusionTemp": 73,
      "targetTemp": 68,
      "length": 70 },
    { "name": "Mash Out",
      "type": "Infusion",
      "amount": 4.8,
      "infusionTemp": 100,
      "targetTemp": 73,
      "length": 10 }
  ]
});
};
