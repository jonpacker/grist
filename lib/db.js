const config = require('../config.json')
const db = require('@awspilot/dynamodb')(config.db.credentials)
const recipes = db.table(config.db.table)

module.exports = recipes
