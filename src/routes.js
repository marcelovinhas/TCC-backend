import { Router } from 'express';
import Usuario from './app/models/Usuario';

const routes = new Router();

routes.get('/', async (req, res) => {
  const usuario = await Usuario.create({
    nome: 'Marcelo Vinhas',
    email: 'marcelo@a.com',
    senha_hash: '123456',
  });

  return res.json(usuario);
});

export default routes;
