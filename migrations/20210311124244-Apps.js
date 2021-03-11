'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.addColumn(
          'Apps',
          'posts',
          {
            type: Sequelize.DataTypes.INTEGER,
            defaultValue: 0,
          },
          { transaction: t }
        ),
        queryInterface.addColumn(
          'Apps',
          'gets',
          {
            type: Sequelize.DataTypes.INTEGER,
            defaultValue: 0,
          },
          { transaction: t }
        ),
      ]);
    });
  },

  down: async () => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
};
