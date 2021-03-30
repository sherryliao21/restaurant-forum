const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User

const userController = {
  signUpPage: (req, res) => {
    return res.render('signup')
  },

  signUp: (req, res) => {
    const { name, email, password, passwordCheck } = req.body
    if (passwordCheck !== password) {
      req.flash('error_msg', '密碼與確認密碼不相符！')
      return res.redirect('/signup')
    } else {
      User.findOne({
        where: { email }
      })
        .then(user => {
          if (user) {
            req.flash('error_msg', '此信箱已註冊！')
            return res.redirect('/signup')
          }
        })
    }

    User.create({
      name,
      email,
      password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
    })
      .then(user => {
        req.flash('success_msg', '成功註冊帳號！')
        return res.render('/signin')
      })
      .catch(err => console.log(err))
  }
}

module.exports = userController