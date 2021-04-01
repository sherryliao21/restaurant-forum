const passport = require('passport')
const adminController = require('../controllers/adminController')
const restController = require('../controllers/restController')
const userController = require('../controllers/userController')
const multer = require('multer')    // file upload middleware
const upload = multer({ dest: 'temp/' })   // upload to temp folder

module.exports = (app) => {

  const authenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
      return next()
    }
    res.redirect('/signin')
  }

  const authenticatedAdmin = (req, res, next) => {
    if (req.isAuthenticated()) {
      if (req.user.isAdmin) {
        return next()
      }
      return res.redirect('/')   // if not admin, show normal user's restaurants page
    }
    res.redirect('/signin')
  }

  app.get('/', authenticated, (req, res) => res.redirect('/restaurants'))  // redirect to /restaurants when access /
  app.get('/restaurants', authenticated, restController.getRestaurants)

  app.get('/admin', authenticatedAdmin, (req, res) => res.redirect('/admin/restaurants'))   // redirect to /admin/restaurants when access /admin
  app.get('/admin/restaurants', authenticatedAdmin, adminController.getRestaurants)

  app.get('/admin/restaurants/create', authenticatedAdmin, adminController.createRestaurant)
  app.post('/admin/restaurants', authenticatedAdmin, upload.single('image'), adminController.postRestaurant)

  app.get('/admin/restaurants/:id', authenticatedAdmin, adminController.getRestaurant)
  app.get('/admin/restaurants/:id/edit', authenticatedAdmin, adminController.editRestaurant)
  app.put('/admin/restaurants/:id', authenticatedAdmin, upload.single('image'), adminController.putRestaurant)
  app.delete('/admin/restaurants/:id', authenticatedAdmin, adminController.deleteRestaurant)

  app.get('/signup', userController.signUpPage)
  app.post('/signup', userController.signUp)

  app.get('/signin', userController.signInPage)
  app.post('/signin', passport.authenticate('local', {
    failureRedirect: '/signin',
    failureFlash: true
  }), userController.signIn)    // no need for successRedirect cuz we have that action covered in userController.signIn

  app.get('/logout', userController.logout)
}
