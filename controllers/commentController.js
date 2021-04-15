const db = require('../models')
const Comment = db.Comment
const helpers = require('../_helpers')
const commentService = require('../services/commentService')

const commentController = {
  postComment: (req, res) => {
    commentService.postComment(req, res, (data) => {
      req.flash('success_msg', data['message'])
      return res.redirect(`/restaurants/${data['restaurantId']}`)
    })
  },

  deleteComment: (req, res) => {
    commentService.deleteComment(req, res, (data) => {
      return res.redirect(`/restaurants/${data['restaurantId']}`)
    })
  }
}

module.exports = commentController