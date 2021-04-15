const db = require('../models')
const Comment = db.Comment
const helpers = require('../_helpers')

const commentService = {
  postComment: (req, res, callback) => {
    const { text, restaurantId } = req.body

    return Comment.create({
      text, RestaurantId: restaurantId, UserId: helpers.getUser(req).id
    })
      .then(comment => {
        callback({ status: 'success', message: 'successfully posted comment', restaurantId })
      })
      .catch(err => console.log(err))
  },

  deleteComment: (req, res, callback) => {
    return Comment.findByPk(req.params.id)
      .then(comment => {
        comment.destroy()
          .then(comment => {
            return callback({ status: 'success', message: '', restaurantId: comment.RestaurantId })
          })
      })
  }
}

module.exports = commentService