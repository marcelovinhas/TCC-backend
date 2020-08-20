// arquivo para realizar a conexão do banco de dados postgres e carregar todos os models da aplicação
// yarn sequelize migration:create --name=criar-usuarios --- cria o arquivo js
// yarn sequelize db:migrate --- cria a tabela
// yarn sequelize db:migrate:undo --- deleta a última tabela criada
import Sequelize from 'sequelize';

import Usuario from '../app/models/Usuario';
import Arquivo from '../app/models/Arquivo';
import Compromisso from '../app/models/Compromisso';

import databaseConfig from '../config/database';

const models = [Usuario, Arquivo, Compromisso]; // array com os models da aplicação

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig); // conexão com a base de dados

    models
      .map((model) => model.init(this.connection)) // percorre os arrays de models

      .map(
        (model) => model.associate && model.associate(this.connection.models) // método associate de models Usuario.js
      );
  }
}

export default new Database();
