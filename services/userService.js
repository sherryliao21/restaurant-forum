const db = require('../models')
const User = db.User
const Comment = db.Comment
const Restaurant = db.Restaurant
const Favorite = db.Favorite
const Like = db.Like
const Followship = db.Followship
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const helpers = require('../_helpers')
const bcrypt = require('bcryptjs')

const userService = {
  signUp: (req, res, callback) => {
    const { name, email, password, passwordCheck } = req.body
    if (passwordCheck !== password) {
      callback({ status: 'error', message: 'passwords didn\'t match!' })
    } else {
      User.findOne({
        where: { email }
      })
        .then(user => {
          if (user) {
            return callback({ status: 'error', message: 'this email address is already in use!' })
          }
          User.create({
            name,
            email,
            password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
          })
            .then(user => {
              callback({ status: 'success', message: 'successfully created account!' })
            })
            .catch(err => console.log(err))
        })
    }
  },

  getUser: (req, res, callback) => {
    return User.findByPk(req.params.id)
      .then(user => {
        Comment.findAndCountAll({
          raw: true, nest: true,
          where: { userId: Number(req.params.id) },
          include: Restaurant
        })
          .then(comments => {
            return callback({
              userProfile: user.toJSON(),
              count: comments.count,
              comments: comments.rows
            })
          })

      })
      .catch(err => console.log(err))
  },

  editUser: (req, res, callback) => {
    const currentUserId = helpers.getUser(req).id
    return User.findByPk(req.params.id)
      .then(user => {
        // you can only see the edit page of your own profile 
        if (currentUserId !== Number(req.params.id)) {
          callback({ status: 'error', message: 'users can only edit their own profiles' })
        }
        callback({ userProfile: user.toJSON() })
      })
      .catch(err => console.log(err))
  },

  putUser: (req, res, callback) => {
    const { name } = req.body
    const id = req.params.id
    const file = req.file

    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID);
      imgur.upload(file.path, (err, img) => {
        return User.findByPk(id)
          .then(user => {
            user.update({
              name,
              avatar: file ? img.data.link : user.avatar
            })
              .then(user => {
                return callback({ status: 'success', message: '成功編輯使用者資訊！' })
              })
          })
      })
    } else {
      return User.findByPk(id)
        .then(user => {
          user.update({
            name, avatar: user.avatar
          })
            .then(user => {
              return callback({ status: 'success', message: '成功編輯使用者資訊！' })
            })
        })
        .catch(err => console.log(err))
    }
  },

  addFavorite: (req, res, callback) => {
    return Favorite.create({
      UserId: helpers.getUser(req).id,
      RestaurantId: req.params.restaurantId
    })
      .then(restaurant => {
        return callback({ status: 'success', message: 'successfully added to favorite' })
      })
      .catch(err => console.log(err))
  },

  removeFavorite: (req, res, callback) => {
    return Favorite.findOne({
      where: {
        UserId: helpers.getUser(req).id,
        RestaurantId: req.params.restaurantId
      }
    })
      .then(favorite => {
        favorite.destroy()
          .then(restaurant => {
            return callback({ status: 'success', message: 'successfully removed from favorite' })
          })
          .catch(err => console.log(err))
      })
      .catch(err => console.log(err))
  },

  Like: (req, res, callback) => {
    return Like.create({
      UserId: helpers.getUser(req).id,
      RestaurantId: req.params.restaurantId
    })
      .then(restaurant => {
        return callback({ status: 'success', message: 'successfully added to like', restaurant: restaurant })
      })
      .catch(err => console.log(err))
  },

  Unlike: (req, res, callback) => {
    return Like.findOne({
      where: {
        UserId: helpers.getUser(req).id,
        RestaurantId: req.params.restaurantId
      }
    })
      .then(restaurant => {
        restaurant.destroy()
          .then(restaurant => {
            return callback({ status: 'success', message: 'successfully removed from like', restaurant: restaurant })
          })
          .catch(err => console.log(err))
      })
      .catch(err => console.log(err))
  },

  getTopUser: (req, res, callback) => {
    return User.findAll({
      include: [
        { model: User, as: 'Followers' }
      ]
    })
      .then(users => {
        users = users.map(user => ({
          ...user.dataValues,
          FollowerCount: user.Followers.length,
          isFollowed: helpers.getUser(req).Followings.map(d => d.id).includes(user.id)
        }))
        users = users.sort((a, b) => b.FollowerCount - a.FollowerCount)
        return callback({ users })
      })
  },

  addFollowing: (req, res, callback) => {
    return Followship.create({
      followerId: helpers.getUser(req).id,
      followingId: req.params.userId
    })
      .then(followship => {
        return callback({ status: 'success', message: 'successfully followed user' })
      })
      .catch(err => console.log(err))
  },

  removeFollowing: (req, res, callback) => {
    return Followship.findOne({
      where: {
        followerId: helpers.getUser(req).id,
        followingId: req.params.userId
      }
    })
      .then(followship => {
        followship.destroy()
          .then((followship) => {
            return callback({ status: 'success', message: 'successfully unfollowed user' })
          })
          .catch(err => console.log(err))
      })
      .catch(err => console.log(err))
  }
}







module.exports = userService