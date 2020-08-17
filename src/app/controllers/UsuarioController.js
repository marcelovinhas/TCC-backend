import * as Yup from 'yup';
import Usuario from '../models/Usuario';

class UsuarioController {
  async store(req, res) {
    const schema = Yup.object().shape({
      nome: Yup.string().required(),
      email: Yup.string().email().required(),
      senha: Yup.string().required().min(6),
    });

    if (!(await schema.isValid(req.body))) {
      // isValid é assíncrono por isso usa await, retorna true ou false
      return res.status(400).json({ error: 'Falha store' });
    }
    // verificar se já existe um usuário com o email informado
    const usuarioUsado = await Usuario.findOne({
      where: { email: req.body.email },
    });

    if (usuarioUsado) {
      // caso exista informa erro
      return res.status(400).json({ error: 'Email já cadastrado' });
    }

    // retornar para o front-end apenas id, nome e email
    const { id, nome, email } = await Usuario.create(req.body);

    return res.json({ id, nome, email });
  }

  // edição dos dados do usuário
  async update(req, res) {
    const schema = Yup.object().shape({
      // object para validar o req.body, shape é o formato do objeto
      // no update não precisa do required para o usuário não ser obrigado a alterar se não quiser
      nome: Yup.string(),
      email: Yup.string().email(),
      senhaAntiga: Yup.string().min(6),
      // se o usuário preencher a senha antiga, ele deseja alterar, então a nova senha é obrigatória
      senha: Yup.string()
        .min(6)
        .when(
          'senhaAntiga',
          (senhaAntiga, field) => (senhaAntiga ? field.required() : field) // se oldPassword for preenchida o campo Password é obrigatório
        ),
      // para confirmar a nova senha
      confirmarSenha: Yup.string().when(
        'senha',
        (senha, field) =>
          senha ? field.required().oneOf([Yup.ref('senha')]) : field
        // oneOf e ref para comparar com o campo password
      ),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Nova senha não confere.' });
    }

    const { email, senha, senhaAntiga } = req.body;

    const usuario = await Usuario.findByPk(req.usuarioId); // findByPk = find by primary key

    if (email !== usuario.email) {
      // se o email que for alterar for diferente do email que já tem
      const usuarioUsado = await Usuario.findOne({ where: { email } });

      if (usuarioUsado) {
        // caso email ja exista informa erro
        return res.status(400).json({ error: 'Email já utilizado.' });
      }
    }
    // se o usuário informou a senha antiga que significa que ele quer alterar, e a senha bater
    if (senhaAntiga && !(await usuario.checkSenha(senhaAntiga))) {
      return res.status(401).json({ error: 'Senha antiga errada.' });
    }

    if (senha && !senhaAntiga) {
      return res.status(401).json({ error: 'Senha antiga não informada.' });
    }

    const { id, nome } = await usuario.update(req.body);

    return res.json({ id, nome, email });
  }
}

export default new UsuarioController();
