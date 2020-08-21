// arquivo para realizar a conexão do banco de dados postgres e carregar todos os models da aplicação
// yarn sequelize migration:create --name=criar-usuarios --- cria o arquivo js
// yarn sequelize db:migrate --- cria a tabela
// yarn sequelize db:migrate:undo --- deleta a última tabela criada
import Sequelize from 'sequelize';
import mongoose from 'mongoose';

import Usuario from '../app/models/Usuario';
import Arquivo from '../app/models/Arquivo';
import Compromisso from '../app/models/Compromisso';

import databaseConfig from '../config/database';

const models = [Usuario, Arquivo, Compromisso]; // array com os models da aplicação

class Database {
  constructor() {
    this.init();
    this.mongo();
  }

  init() {
    this.connection = new Sequelize(databaseConfig); // conexão com a base de dados

    models
      .map((model) => model.init(this.connection)) // percorre os arrays de models

      .map(
        (model) => model.associate && model.associate(this.connection.models) // método associate de models Usuario.js
      );
  }

  mongo() {
    this.mongoConnection = mongoose.connect(
      'mongodb://192.168.99.100:27017/tcc', // url de conexão do mongo
      { useNewUrlParser: true, useUnifiedTopology: true }
      // useNewUrlParser pq está usando um formato de url do mongodb mais nova, que não era usado antes
      // useUnifiedTopology era pra ser useFindAndModify configuração para encontrar e modificar registros
    );
  }
}

export default new Database();
