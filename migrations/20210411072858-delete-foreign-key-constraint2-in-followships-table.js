'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint('Followships', 'followships_ibfk_2')
  },

  down: async (queryInterface, Sequelize) => {
    const options = {
      type: 'foreign key',
      name: 'followships_ibfk_2',
      fields: ['followingId'],
      references: {
        table: 'Users',
        field: 'id'
      }
    }
    await queryInterface.addConstraint('Followships', options)
  }
}