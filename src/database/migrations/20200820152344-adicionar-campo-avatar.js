module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('usuarios', 'avatar_id', {
      type: Sequelize.INTEGER, // INTEGER pq vai referenciar apenas o id e não imagem em si e não todo conteúdo dela
      references: { model: 'arquivos', key: 'id' }, // references é uma chave estrangeira (banco relacional)
      onUpdate: 'CASCADE', // se um dia o arquivo da tabela for alterado
      onDelete: 'SET NULL', // se um dia o arquivo da tabela for deletado
      allowNull: true,
    });
  },

  down: (queryInterface) => {
    return queryInterface.removeColumn('usuarios', 'avatar_id');
  },
};
