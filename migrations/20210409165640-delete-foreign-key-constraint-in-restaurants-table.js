'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint('Restaurants', 'restaurants_ibfk_1')
  },

  down: async (queryInterface, Sequelize) => {
    const options = {
      type: 'foreign key',
      name: 'restaurants_ibfk_1',
      fields: ['CategoryId'],
      references: {
        table: 'Categories',
        field: 'id'
      }
    }
    await queryInterface.addConstraint('Restaurants', options)
  }
}