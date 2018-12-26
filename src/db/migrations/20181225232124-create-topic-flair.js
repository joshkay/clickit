'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('TopicFlair', {
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      topicId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
      },
      flairId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
      },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('TopicFlair');
  }
};
