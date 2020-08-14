// arquivo para realizar a conexão do banco de dados postgres e carregar todos os models da aplicação
import Sequelize from 'sequelize';

import Usuario from '../app/models/Usuario';

import databaseConfig from '../config/database';

const models = [Usuario]; // array com os models da aplicação

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig); // conexão com a base de dados

    models.map((model) => model.init(this.connection)); // percorre os arrays de models
  }
}

export default new Database();
