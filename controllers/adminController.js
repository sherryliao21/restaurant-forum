const db = require('../models')
const Restaurant = db.Restaurant

const adminController = {
  getRestaurants: (req, res) => {
    return Restaurant.findAll({ raw: true })   // raw: true to turn sequelize object into JavaScript object
      .then(restaurants => {
        return res.render('admin/restaurants', { restaurants })
      })
      .catch(err => console.log(err))
  },
  createRestaurant: (req, res) => {
    return res.render('admin/create')
  },
  postRestaurant: (req, res) => {
    const { name, tel, address, opening_hours, description } = req.body
    if (!name) {
      req.flash('error_msg', '所有欄位都是必填')
      // return res.render('admin/create', { name, tel, address, opening_hour, description })
      return res.redirect('back')
    }
    return Restaurant.create({
      name, tel, address, opening_hours, description
    })
      .then(restaurant => {
        req.flash('success_msg', '成功新增餐廳！')
        return res.redirect('/admin/restaurants')
      })
      .catch(err => console.log(err))
  },
  getRestaurant: (req, res) => {
    const id = req.params.id
    return Restaurant.findByPk(id, { raw: true })
      .then(restaurant => {
        return res.render('admin/restaurant', { restaurant })
      })
      .catch(err => console.log(err))
  }
}

module.exports = adminController