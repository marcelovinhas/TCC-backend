import Sequelize, { Model } from 'sequelize';

class Usuario extends Model {
  static init(sequelize) {
    super.init(
      {
        // super = Model, está chamando o método init da classe Model
        // os campos dentro do model, não precisam ser um reflexo dos campos da base de dados
        nome: Sequelize.STRING,
        email: Sequelize.STRING,
        // password: Sequelize.VIRTUAL, // VIRTUAl é um campo que não vai existir na base de dados, apenas no código
        senha_hash: Sequelize.STRING,
      },
      {
        sequelize, // o sequelize recebido no parâmetro static init (sequelize) precisa ser passado
      }
    );
  }
}

export default Usuario;
