const bcrypt = require('bcryptjs')
const db = require('../../models')
const User = db.User

// declare JWT variables
const jwt = require('jsonwebtoken')
const passportJWT = require('passport-jwt')
const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy

let userController = {
  signUp: (req, res) => {
    if (req.body.passwordCheck !== req.body.password) {
      return res.json({ status: 'error', message: '兩次密碼輸入不同！' })
    } else {
      User.findOne({ where: { email: req.body.email } })
        .then(user => {
          if (user) {
            return res.json({ status: 'error', message: '信箱重複！' })
          } else {
            User.create({
              name: req.body.name,
              email: req.body.email,
              password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
            })
              .then(user => {
                return res.json({ status: 'success', message: '成功註冊帳號！' })
              })
          }
        })
    }
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
  }
}

module.exports = userController