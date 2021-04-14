const bcrypt = require('bcryptjs')
const db = require('../../models')
const User = db.User
const userService = require('../../services/userService')

// declare JWT variables
const jwt = require('jsonwebtoken')
const passportJWT = require('passport-jwt')
const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy

let userController = {
  signUp: (req, res) => {
    userService.signUp(req, res, (data) => {
      return res.json(data)
    })
  },

  signIn: (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
      return res.json({ status: 'error', message: 'required fields didn\'t exist' })
    }
    User.findOne({ where: { email } })
      .then(user => {
        if (!user) {
          return res.status(401).json({ status: 'error', message: 'no such user found' })
        }
        if (!bcrypt.compareSync(password, user.password)) {
          return res.status(401).json({ status: 'error', message: 'passwords didn\'t match' })
        }
        var payload = { id: user.id }
        var token = jwt.sign(payload, process.env.JWT_SECRET)
        return res.json({
          status: 'success', message: 'ok',
          token, user: { id: user.id, name: user.name, email: user.email, isAdmin: user.isAdmin }
        })
      })
  },

  getUser: (req, res) => {
    userService.getUser(req, res, (data) => {
      return res.json(data)
    })
  },

  editUser: (req, res) => {
    userService.editUser(req, res, (data) => {
      return res.json(data)
    })
  },

  putUser: (req, res) => {
    userService.putUser(req, res, (data) => {
      return res.json(data)
    })
  }
}

module.exports = userController