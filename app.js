const express = require('express')
const handlebars = require('express-handlebars')
const db = require('./models')
const flash = require('connect-flash')
const session = require('express-session')
const bodyParser = require('body-parser')
const { storeLocalVariables } = require('./middlewares/storeLocalVariables')

const app = express()
const port = 3000

app.engine('handlebars', handlebars({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false
}))
app.use(flash())
app.use(storeLocalVariables)


app.listen(port, () => {
  db.sequelize.sync()  // sync models with our database
  console.log(`Example app listening at http://localhost:${port}`)
})

require('./routes')(app)

module.exports = app
