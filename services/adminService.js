const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category
const User = db.User
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const helpers = require('../_helpers')

const adminService = {
  getRestaurants: (req, res, callback) => {
    return Restaurant.findAll({ raw: true, nest: true, include: [Category], order: [['id', 'DESC']] })
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
  },

  postRestaurant: (req, res, callback) => {
    const { name, tel, address, opening_hours, description, categoryId } = req.body
    if (!name) {
      return callback({ status: 'error', message: "name didn't exist" })
    }


    const file = req.file
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID);
      imgur.upload(file.path, (err, img) => {
        return Restaurant.create({
          name, tel, address, opening_hours, description,
          image: file ? img.data.link : null,
          CategoryId: categoryId
        }).then(restaurant => {
          callback({ status: 'success', message: 'restaurant was successfully created!' })
        })
      })
    } else {
      return Restaurant.create({
        name, tel, address, opening_hours, description, image: null, CategoryId: categoryId   // if no file, use null for image path
      })
        .then(restaurant => {
          callback({ status: 'success', message: 'restaurant was successfully created!' })
        })
        .catch(err => console.log(err))
    }
  },

  putRestaurant: (req, res, callback) => {
    const id = req.params.id
    const { name, tel, address, opening_hours, description, categoryId } = req.body
    const file = req.file
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID);
      imgur.upload(file.path, (err, img) => {
        return Restaurant.findByPk(id)
          .then((restaurant) => {
            restaurant.update({
              name, tel, address, opening_hours, description,
              image: file ? img.data.link : restaurant.image,
              CategoryId: categoryId
            })
              .then((restaurant) => {
                callback({ status: 'success', message: 'restaurant was successfully edited!' })
              })
          })
      })
    } else {
      return Restaurant.findByPk(id)
        .then(restaurant => {
          restaurant.update({
            name, tel, address, opening_hours, description, image: restaurant.image, CategoryId: categoryId
          })
        })
        .then(restaurant => {
          callback({ status: 'success', message: 'restaurant was successfully edited!' })
        })
        .catch(err => console.log(err))
    }
  },

  createRestaurant: (req, res, callback) => {
    Category.findAll({
      raw: true,
      nest: true
    })
      .then(categories => {
        callback({ categories })
      })
      .catch(err => console.log(err))
  },

  editRestaurant: (req, res, callback) => {
    const id = req.params.id

    Category.findAll({ raw: true, nest: true })
      .then(categories => {
        return Restaurant.findByPk(id)
          .then(restaurant => {
            callback({ categories, restaurant: restaurant.toJSON() })
          })
          .catch(err => console.log(err))
      })
  },

  getUsers: (req, res, callback) => {
    return User.findAll({ raw: true, nest: true })
      .then(users => {
        callback({ users })
      })
      .catch(err => console.log(err))
  },

  toggleAdmin: (req, res, callback) => {
    const id = req.params.id

    return User.findByPk(id)
      .then(user => {
        // // 如果有啟動預防管理員將自己設為 user 的機制，測試會跑不過，所以先 comment 起來
        if (helpers.getUser(req).id === user.id) {
          callback({ status: 'error', message: 'admin cannot set itself as user!' })
          return res.redirect('/admin/users')
        }
        return user.update({
          name: user.name,
          email: user.email,
          password: user.password,
          createdAt: user.createdAt,
          updatedAt: new Date(),
          isAdmin: user.isAdmin ? 0 : 1    // if user.isAdmin === '1', swap value to '0'; if opposite, swap value to '1'
        })
      })
      .then(user => {
        callback({ status: 'success', message: 'user authorization was successfully modified!' })
      })
      .catch(err => console.log(err))
  }
}


module.exports = adminService