import { Router } from 'express';

import UsuarioController from './app/controllers/UsuarioController';
import LoginController from './app/controllers/LoginController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.post('/usuarios', UsuarioController.store);
routes.post('/login', LoginController.store);

routes.use(authMiddleware);
routes.put('/usuarios', UsuarioController.update);

export default routes;
