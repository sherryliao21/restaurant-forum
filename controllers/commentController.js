const db = require('../models')
const Comment = db.Comment
const helpers = require('../_helpers')

const commentController = {
  postComment: (req, res) => {
    const { text, restaurantId } = req.body

    return Comment.create({
      text, RestaurantId: restaurantId, UserId: helpers.getUser(req).id
    })
      .then(comment => {
        return res.redirect(`/restaurants/${restaurantId}`)
      })
      .catch(err => console.log(err))
  }
}

module.exports = commentController