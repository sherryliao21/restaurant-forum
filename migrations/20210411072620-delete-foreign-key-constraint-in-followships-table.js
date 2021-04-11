'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint('Followships', 'followships_ibfk_1')
  },

  down: async (queryInterface, Sequelize) => {
    const options = {
      type: 'foreign key',
      name: 'followships_ibfk_1',
      fields: ['followerId'],
      references: {
        table: 'Users',
        field: 'id'
      }
    }
    await queryInterface.addConstraint('Followships', options)
  }
}