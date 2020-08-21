import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import UsuarioController from './app/controllers/UsuarioController';
import LoginController from './app/controllers/LoginController';
import ArquivoController from './app/controllers/ArquivoController';
import CompromissoController from './app/controllers/CompromissoController';
import NotificacaoController from './app/controllers/NotificacaoController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();
const upload = multer(multerConfig);

// criação de usuários no Insomnia
routes.post('/usuarios', UsuarioController.store);

// rota para logar
routes.post('/login', LoginController.store);

// como está depois das duas rotas anteriores, só vai valer pras rotas que vem depois
routes.use(authMiddleware);

// rota para atualizar dados
routes.put('/usuarios', UsuarioController.update);

// rota para listagem
routes.get('/compromissos', CompromissoController.index);

// rota para agendamento
routes.post('/compromissos', CompromissoController.store);

routes.delete('/compromissos/:id', CompromissoController.delete);

// rota para lista de notificações dos compromissos do usuário
routes.get('/notificacoes', NotificacaoController.index);

// rota para marcar uma notificação como lida, recebendo o id da notificação, precisa passar o id no Insomnia
routes.put('/notificacoes/:id', NotificacaoController.update);

// rota do multer - imagem, no Insomnia criar post em multipart em vez de JSON
// single para fazer um upload por vez e não vários e o nome do campo da requisição file
routes.post('/arquivos', upload.single('arquivo'), ArquivoController.store);

export default routes;
