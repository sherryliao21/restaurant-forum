'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint('Likes', 'likes_ibfk_2')
  },

  down: async (queryInterface, Sequelize) => {
    const options = {
      type: 'foreign key',
      name: 'likes_ibfk_2',
      fields: ['RestaurantId'],
      references: {
        table: 'Restaurants',
        field: 'id'
      }
    }
    await queryInterface.addConstraint('Likes', options)
  }
}
