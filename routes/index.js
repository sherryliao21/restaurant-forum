const adminController = require('../controllers/adminController')
const restController = require('../controllers/restController')

module.exports = (app) => {

  app.get('/', (req, res) => res.redirect('/restaurants'))  // redirect to /restaurants when access /
  app.get('/restaurants', restController.getRestaurants)

  app.get('/admin', (req, res) => res.redirect('/admin/restaurants'))   // redirect to /admin/restaurants when access /admin
  app.get('/admin/restaurants', adminController.getRestaurants)
}
