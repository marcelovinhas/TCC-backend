import crypto from 'crypto';
import * as Yup from 'yup';
import Usuario from '../models/Usuario';
import EsquecerSenhaMail from '../jobs/EsquecerSenhaMail';
import Queue from '../../lib/Queue';

class ForgotPasswordController {
  async store(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string().email().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { email } = req.body;

    const usuario = await Usuario.findOne({
      where: {
        email,
      },
    });

    if (!usuario) {
      return res.status(400).json({ error: 'Email não existe' });
    }

    const token = crypto.randomBytes(4).toString('hex');

    const now = new Date();

    now.setHours(now.getHours() + 1);

    const { senha_reset_token, senha_reset_expira } = await usuario.update({
      senha_reset_token: token,
      senha_reset_expira: now,
    });

    await Queue.add(EsquecerSenhaMail.key, {
      token,
      usuario: {
        nome: usuario.nome,
        email: usuario.email,
      },
    });

    return res.json({
      senha_reset_token,
      senha_reset_expira,
    });
  }
}

export default new ForgotPasswordController();
