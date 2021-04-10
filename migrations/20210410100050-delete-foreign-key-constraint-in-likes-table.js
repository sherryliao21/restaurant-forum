'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint('Likes', 'likes_ibfk_1')
  },

  down: async (queryInterface, Sequelize) => {
    const options = {
      type: 'foreign key',
      name: 'likes_ibfk_1',
      fields: ['UserId'],
      references: {
        table: 'Users',
        field: 'id'
      }
    }
    await queryInterface.addConstraint('Favorites', options)
  }
}