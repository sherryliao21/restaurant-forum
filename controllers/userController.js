const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User
const helpers = require('../_helpers')

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
        return res.render('signin')
      })
      .catch(err => console.log(err))
  },

  signInPage: (req, res) => {
    return res.render('signin')
  },

  signIn: (req, res) => {
    req.flash('success_msg', '登入成功！')
    res.redirect('/restaurants')
  },

  logout: (req, res) => {
    req.flash('success_msg', '成功登出！')
    req.logout()
    res.redirect('/signin')
  },

  getUser: (req, res) => {
    return User.findByPk(req.params.id)
      .then(user => {
        return res.render('profile', { userProfile: user.toJSON() })
      })
      .catch(err => console.log(err))
  },

  editUser: (req, res) => {
    const currentUserId = helpers.getUser(req).id
    return User.findByPk(req.params.id)
      .then(user => {
        // you can only see the edit page of your own profile 
        if (currentUserId !== Number(req.params.id)) {
          req.flash('error_msg', '使用者只能編輯自己的個人資料')
          return res.redirect(`/users/${currentUserId}/edit`)
        }

        return res.render('editProfile', { userProfile: user.toJSON() })
      })
      .catch(err => console.log(err))
  },

  putUser: (req, res) => {
    const currentUserId = helpers.getUser(req).id
    const { name, image } = req.body
    return User.findByPk(req.params.id)
      .then(user => {
        // you can only edit your own profile 
        if (currentUserId !== req.params.id) {
          return res.redirect('back')
        }

        if (!name) {
          req.flash('error_msg', '所有欄位都是必填')
          return res.redirect('back')
        }



      })
  }
}

module.exports = userController