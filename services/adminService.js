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
  }
}


module.exports = adminService