const db = require('../models')
const categoryService = require('../services/categoryService')
const Category = db.Category

const categoryController = {
  getCategories: (req, res) => {
    categoryService.getCategories(req, res, (data) => {
      res.render('admin/categories', data)
    })
  },
  postCategory: (req, res) => {
    categoryService.postCategory(req, res, (data) => {
      if (data['status'] === 'error') {
        req.flash('error_msg', data['message'])
        return res.redirect('back')
      }
      req.flash('success_msg', 'successfully created category')
      res.redirect('/admin/categories')
    })
  },
  putCategory: (req, res) => {
    categoryService.putCategory(req, res, (data) => {
      if (data['status'] === 'error') {
        req.flash('error_msg', data['message'])
        return res.redirect('back')
      }
      req.flash('success_msg', 'successfully edited category')
      res.redirect('/admin/categories')
    })
  },
  deleteCategory: (req, res) => {
    return Category.findByPk(req.params.id)
      .then(category => {
        category.destroy()
          .then(category => {
            res.redirect('/admin/categories')
          })
          .catch(err => console.log(err))
      })
      .catch(err => console.log(err))
  }
}

module.exports = categoryController