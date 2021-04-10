'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint('Favorites', 'favorites_ibfk_1')
  },

  down: async (queryInterface, Sequelize) => {
    const options = {
      type: 'foreign key',
      name: 'favorites_ibfk_1',
      fields: ['UserId'],
      references: {
        table: 'Users',
        field: 'id'
      }
    }
    await queryInterface.addConstraint('Favorites', options)
  }
}