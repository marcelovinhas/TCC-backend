module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('compromissos', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      data: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      assunto: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      usuario_id: {
        type: Sequelize.INTEGER, // INTEGER pq vai referenciar apenas o id e não imagem em si e não todo conteúdo dela
        references: { model: 'usuarios', key: 'id' }, // references é uma chave estrangeira (banco relacional)
        onUpdate: 'CASCADE', // se um dia o arquivo da tabela for alterado
        onDelete: 'SET NULL', // quando o usuário for deletado, todos os agendamentos ficaram no histórico
        allowNull: true,
      },
      amigo_id: {
        type: Sequelize.INTEGER,
        references: { model: 'usuarios', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        allowNull: true,
      },
      canceled_at: {
        type: Sequelize.DATE,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: (queryInterface) => {
    return queryInterface.dropTable('usuarios');
  },
};
