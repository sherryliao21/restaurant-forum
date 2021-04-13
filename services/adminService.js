const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category

const adminService = {
  getRestaurants: (req, res, callback) => {
    return Restaurant.findAll({ raw: true, nest: true, include: [Category], order: [['id', 'DESC']] })   // raw: true to turn sequelize object into JavaScript object
      .then(restaurants => {
        callback({ restaurants })
      })
      .catch(err => console.log(err))
  },
  getRestaurant: (req, res, callback) => {
    const id = req.params.id
    return Restaurant.findByPk(id, { include: [Category] })
      .then(restaurant => {
        callback({ restaurant: restaurant.toJSON() })
      })
      .catch(err => console.log(err))
  },
  deleteRestaurant: (req, res, callback) => {
    const id = req.params.id
    return Restaurant.findByPk(id)
      .then(restaurant => {
        restaurant.destroy()
          .then(restaurant => {
            callback({ status: 'success', message: '' })
          })
          .catch(err => console.log(err))
      })
      .catch(err => console.log(err))
  }
}


module.exports = adminService