const passport = require('passport')
const adminController = require('../controllers/adminController')
const restController = require('../controllers/restController')
const userController = require('../controllers/userController')

module.exports = (app) => {

  app.get('/', (req, res) => res.redirect('/restaurants'))  // redirect to /restaurants when access /
  app.get('/restaurants', restController.getRestaurants)

  app.get('/admin', (req, res) => res.redirect('/admin/restaurants'))   // redirect to /admin/restaurants when access /admin
  app.get('/admin/restaurants', adminController.getRestaurants)

  app.get('/signup', userController.signUpPage)
  app.post('/signup', userController.signUp)

  app.get('/signin', userController.signInPage)
  app.post('/signin', passport.authenticate('local', {
    failureRedirect: '/signin',
    failureFlash: true
  }), userController.signIn)    // no need for successRedirect cuz we have that action covered in userController.signIn

  app.get('/logout', userController.logout)
}
