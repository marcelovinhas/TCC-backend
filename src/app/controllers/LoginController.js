// arquivo para autenticação do usuário, para logar
// não usa o arquivo UsuarioController.js pq nesse arquivo cria uma sessão e não um usuário
// e no UsuarioController já tem o método store e só pode ter uma vez o mesmo método em uma classe
// e só pode ter 5 métodos: index, show, store, update e delete dentro de um controller
import jwt from 'jsonwebtoken'; // yarn add jsonwebtoken
import * as Yup from 'yup';

import Usuario from '../models/Usuario';
import authConfig from '../../config/auth';

class LoginController {
  async store(req, res) {
    const schema = Yup.object().shape({
      // object para validar o req.body, shape é o formato do objeto
      email: Yup.string().email().required(), // para logar precisa do email e senha
      senha: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      // isValid é assíncrono por isso usa await, retorna true ou false
      return res.status(400).json({ error: 'Falha na validação.' });
    }

    const { email, senha } = req.body;

    // verifica se existe um usuário com o email
    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) {
      return res.status(401).json({ error: 'Usuário não encontrado.' });
    }

    // verifica se a senhas NÃO estão batendo, precisa do await pq o bcrypt.compare é assíncrono
    if (!(await usuario.checkSenha(senha))) {
      return res.status(401).json({ error: 'Senha incorreta.' });
    }

    // retornar os dados do usuário
    const { id, nome } = usuario;

    return res.json({
      usuario: {
        id,
        nome,
        email,
      },

      /* PRIMEIRO PARÂMETRO
      no método sign envia o payload que são informações adicionais que quer incorporar no token
      coloca no token o id do usuário para ter acesso a essa informação depois que reutilizar o token
      na parte do texto precisa ser um texto único no mundo
      SEGUNDO PARÂMETRO
      entrar no site https://www.md5online.org/, digitar alguma coisa aleatória na barra que ngm nunca tenha escrito
      pega o código e coloca como segundo parâmetro
      TERCEIRO PARÂMETRO
      todo token jwt tem data de expiração, se deixa o token como infinito se o usuário tiver o token ele vai poder
      fazer o que quiser quando quiser, geralmente coloca 7 dias
      */

      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}

export default new LoginController();
