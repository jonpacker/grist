const beerjson = require('beerjson')
const slug = require('slug')
const shortid = require('shortid')

function readBeerXmlFromRequest (req) {
  return new Promise((resolve, reject) => {
    let beerXml = ''
    req.on('data', ch => { beerXml += ch })
    req.on('end', () => {
      beerjson.fromBeerXml(beerXml.toString(), function (err, recipe) {
        if (err) reject(err)
        else resolve(recipe)
      })
    })
  })
};

module.exports = app => {
  app.post('/', async (req, res) => {
    const recipe = await readBeerXmlFromRequest(req)
    recipe.slug = `${slug(recipe.name).toLowerCase()}-${shortid()}`
    await app.db.insert({
      slug: `grist_${recipe.slug}`,
      data: JSON.stringify(recipe)
    })
    res.status(201).json({ path: `/${recipe.slug}` })
  })

  app.get('/json/:slug', async (req, res) => {
    const recipe = await app.db.where('slug').eq(`grist_${req.params.slug}`).get()
    if (!recipe) return res.sendStatus(404)
    res.set('Content-Type', 'application/json')
    res.end(recipe.data)
  })

  app.put('/:slug', async (req, res) => {
    const recipe = await readBeerXmlFromRequest(req)
    await app.db.update({
      slug: `grist_${recipe.slug}`,
      data: JSON.stringify(recipe)
    })
    res.sendStatus(200)
  })

  app.get('/:slug', async (req, res) => {
    const recipe = await app.db.where('slug').eq(`grist_${req.params.slug}`).get()
    if (!recipe || !recipe.data) return res.sendStatus(404)
    res.status(200)
    res.set('Content-Type', 'text/html')
    res.end(app.templates.index(Object.assign({}, app.locals, JSON.parse(recipe.data))))
  })

  app.delete('/:slug', async (req, res) => {
    await app.db.delete(`grist_${req.params.slug}`)
  })
}
