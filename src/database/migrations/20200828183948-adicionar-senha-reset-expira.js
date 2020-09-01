module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('usuarios', 'senha_reset_expira', {
      type: Sequelize.DATE,
      defaultValue: null,
    });
  },

  down: (queryInterface) => {
    return queryInterface.removeColumn('usuarios', 'senha_reset_expira');
  },
};
