module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('usuarios', 'senha_reset_token', {
      type: Sequelize.STRING,
      defaultValue: null,
    });
  },

  down: (queryInterface) => {
    return queryInterface.removeColumn('usuarios', 'senha_reset_token');
  },
};
