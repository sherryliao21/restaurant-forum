const express = require('express')
const handlebars = require('express-handlebars')
const db = require('./models')
const app = express()
const port = 3000
const bodyParser = require('body-parser')

app.engine('handlebars', handlebars({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
app.use(bodyParser.urlencoded({ extended: true }))


app.listen(port, () => {
  db.sequelize.sync()  // sync models with our database
  console.log(`Example app listening at http://localhost:${port}`)
})

require('./routes')(app)

module.exports = app
