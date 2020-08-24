import Sequelize, { Model } from 'sequelize';
import { isBefore, subHours } from 'date-fns';

class Compromisso extends Model {
  static init(sequelize) {
    super.init(
      {
        // super = Model, está chamando o método init da classe Model
        // os campos dentro do model, não precisam ser um reflexo dos campos da base de dados
        data: Sequelize.DATE,
        canceled_at: Sequelize.DATE,
        passado: {
          // agendamento passado para mostrar no front end
          type: Sequelize.VIRTUAL, // virtual não existe na tabela, apenas em js
          get() {
            // para retornar ao type
            return isBefore(this.data, new Date()); // retorna true se o horário já passou
          },
        },
        cancelavel: {
          // retorna se o agendamento pode ser cancelado (no máximo até duas horas antes)
          type: Sequelize.VIRTUAL,
          get() {
            return isBefore(new Date(), subHours(this.data, 2));
          },
        },
      },
      {
        sequelize, // o sequelize recebido no parâmetro static init (sequelize) precisa ser passado
      }
    );

    return this;
  }

  // relacionamento com a tabela
  static associate(models) {
    this.belongsTo(models.Usuario, { foreignKey: 'usuario_id', as: 'usuario' });
  }
}

export default Compromisso;
