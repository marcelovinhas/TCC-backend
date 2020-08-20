import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs'; // gerar o hash da senha - yarn add bcryptjs

class Usuario extends Model {
  static init(sequelize) {
    super.init(
      {
        // super = Model, está chamando o método init da classe Model
        // os campos dentro do model, não precisam ser um reflexo dos campos da base de dados
        nome: Sequelize.STRING,
        email: Sequelize.STRING,
        // VIRTUAl é um campo que não vai existir na base de dados, apenas no código
        senha: Sequelize.VIRTUAL,
        senha_hash: Sequelize.STRING,
      },
      {
        sequelize, // o sequelize recebido no parâmetro static init (sequelize) precisa ser passado
      }
    );

    // Hooks são trechos de código executados de forma automática de acordo com as ações do model
    // beforeSave antes de qualquer usuário ser editado ou criado, o treco de código abaixo vai se executado automaticamente
    this.addHook('beforeSave', async (usuario) => {
      // ver se está cadastrando um novo usuário ou editando um usuário gerar um o hash da senha
      // 8 é o número de caracteres da criptografia
      if (usuario.senha) {
        usuario.senha_hash = await bcrypt.hash(usuario.senha, 8);
      }
    });

    return this;
  }

  // ADICIONAR AVATAR_ID NO SUPER.INIT PODE DAR PROBLEMA ENTÃO:
  static associate(models) {
    this.belongsTo(models.Arquivo, { foreignKey: 'avatar_id' }); // model de usuário percence ao model de file
  }

  // compara a senha que o usuário tenta logar com a senha do banco de dados
  checkSenha(senha) {
    return bcrypt.compare(senha, this.senha_hash);
  }
}

export default Usuario;
