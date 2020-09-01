import * as Yup from 'yup';
import Usuario from '../models/Usuario';

class ResetarSenhaController {
  async store(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string().email().required(),
      senha: Yup.string().min(6).required(),
      confirmarSenha: Yup.string()
        .required()
        .oneOf([Yup.ref('senha')]),
      token: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { senha, token, email } = req.body;

    const usuario = await Usuario.findOne({
      where: {
        email,
      },
    });

    if (usuario.senha_reset_token !== token) {
      return res.status(400).json({ error: 'Invalid Token' });
    }

    const now = new Date();
    if (now > usuario.senha_reset_expira) {
      return res
        .status(400)
        .json({ error: 'Token expirado, gere um novo token' });
    }

    await usuario.update({
      senha,
      senha_reset_token: null,
      senha_reset_expira: null,
    });
    return res.json({ message: 'Senha alterada com sucesso' });
  }
}

export default new ResetarSenhaController();
