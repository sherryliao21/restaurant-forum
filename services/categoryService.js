const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category

const categoryService = {
  getCategories: (req, res, callback) => {
    return Category.findAll({ raw: true, nest: true })
      .then(categories => {
        if (req.params.id) {
          Category.findByPk(req.params.id)
            .then(category => {
              return res.render('admin/categories', { categories, category: category.toJSON() })
            })
            .catch(err => console.log(err))
        } else {
          callback({ categories })
        }
      })
      .catch(err => console.log(err))
  },

  postCategory: (req, res, callback) => {
    const { name } = req.body
    if (!name) {
      callback({ status: 'error', message: 'name didn\'t exist' })
    } else {
      return Category.create({ name })
        .then(category => {
          callback({ status: 'success', message: 'successfully posted category' })
        })
    }
  },

  putCategory: (req, res, callback) => {
    const { name } = req.body
    if (!name) {
      callback({ status: 'error', message: 'name didn\'t exist' })
    } else {
      return Category.findByPk(req.params.id)
        .then(category => {
          category.update({ name })
            .then(category => {
              callback({ status: 'success', message: 'successfully edited category' })
            })
        })
    }
  }
}

module.exports = categoryService