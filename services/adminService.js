const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

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
  }
}


module.exports = adminService