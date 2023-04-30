module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.addColumn('sms', 'status', {
      type: Sequelize.STRING,
    });
  },

  async down(queryInterface) {
    return queryInterface.removeColumn('sms', 'status');
  },
};
