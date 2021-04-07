const db = require('../models')
const Category = db.Category

const categoryController = {
  getCategories: (req, res) => {
    Category.findAll({ raw: true, nest: true })
      .then(categories => {
        return res.render('admin/categories', { categories })
      })
      .catch(err => console.log(err))
  },
  postCategory: (req, res) => {
    const { name } = req.body
    if (!name) {
      req.flash('error_msg', '請輸入類別名稱！')
      return res.redirect('back')
    } else {
      return Category.create({ name })
        .then(category => {
          res.redirect('/admin/categories')
        })
    }

  }
}

module.exports = categoryController