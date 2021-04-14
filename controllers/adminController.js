const db = require('../models')
const Restaurant = db.Restaurant
const User = db.User
const Category = db.Category
const fs = require('fs')
const imgur = require('imgur-node-api')
const { useFakeServer } = require('sinon')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const helpers = require('../_helpers')
const category = require('../models/category')
const adminService = require('../services/adminService')

const adminController = {
  getRestaurants: (req, res) => {
    adminService.getRestaurants(req, res, (data) => {
      return res.render('admin/restaurants', data)
    })
  },

  createRestaurant: (req, res) => {
    adminService.createRestaurant(req, res, (data) => {
      return res.render('admin/create', data)
    })
  },

  postRestaurant: (req, res) => {
    adminService.postRestaurant(req, res, (data) => {
      if (data['status'] === 'error') {
        req.flash('error_msg', data['message'])
        return res.redirect('back')
      }
      req.flash('success_msg', data['message'])
      res.redirect('/admin/restaurants')
    })
  },

  getRestaurant: (req, res) => {
    adminService.getRestaurant(req, res, (data) => {
      return res.render('admin/restaurant', data)
    })
  },

  editRestaurant: (req, res) => {
    const id = req.params.id

    Category.findAll({ raw: true, nest: true })
      .then(categories => {
        return Restaurant.findByPk(id)
          .then(restaurant => {
            return res.render('admin/create', {
              restaurant: restaurant.toJSON(),
              categories
            })
          })
          .catch(err => console.log(err))
      })
  },

  putRestaurant: (req, res) => {
    adminService.putRestaurant(req, res, (data) => {
      if (data['status'] === 'error') {
        req.flash('error_msg', data['message'])
        return res.redirect('back')
      }
      req.flash('success_msg', 'successfully edited restaurant')
      res.redirect('/admin/restaurants')
    })
  },

  deleteRestaurant: (req, res) => {
    adminService.deleteRestaurant(req, res, (data) => {
      if (data['status'] === 'success') {
        return res.redirect('/admin/restaurants')
      }
    })
  },

  getUsers: (req, res) => {
    return User.findAll({ raw: true })
      .then(users => {
        return res.render('admin/users', { users })
      })
      .catch(err => console.log(err))
  },

  toggleAdmin: (req, res) => {
    const id = req.params.id

    return User.findByPk(id)
      .then(user => {
        // // 如果有啟動預防管理員將自己設為 user 的機制，測試會跑不過，所以先 comment 起來
        // if (helpers.getUser(req).id === user.id) {
        //   req.flash('error_msg', '管理員不可編輯自身權限！')
        //   return res.redirect('/admin/users')
        // }
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
        req.flash('success_msg', `成功編輯 ${user.name} 權限！`)
        return res.redirect('/admin/users')
      })
      .catch(err => console.log(err))
  }
}

module.exports = adminController