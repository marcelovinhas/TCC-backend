import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import UsuarioController from './app/controllers/UsuarioController';
import LoginController from './app/controllers/LoginController';
import ArquivoController from './app/controllers/ArquivoController';
import CompromissoController from './app/controllers/CompromissoController';
import NotificacaoController from './app/controllers/NotificacaoController';
import LivreController from './app/controllers/LivreController';
import AgendaController from './app/controllers/AgendaController';
import AmigoController from './app/controllers/AmigoController';

import EsquecerSenhaController from './app/controllers/EsquecerSenhaController';
import ResetarSenhaController from './app/controllers/ResetarSenhaController';
import authMiddleware from './app/middlewares/auth';

const routes = new Router();
const upload = multer(multerConfig);

// criação de usuários no Insomnia
routes.post('/usuarios', UsuarioController.store);

// rota para logar
routes.post('/login', LoginController.store);

// ROTA ESQUECI A SENHA
routes.post('/esquecer', EsquecerSenhaController.store);

// ROTA RESETAR SENHA
routes.post('/resetar', ResetarSenhaController.store);

// como está depois das duas rotas anteriores, só vai valer pras rotas que vem depois
routes.use(authMiddleware);

// rota para atualizar dados
routes.put('/usuarios', UsuarioController.update);

// NOVO - rota para listar os amigos
routes.get('/amigos', AmigoController.index);

// rota para listar horários disponíveis do prestador de serviço em um dia
// em query enviar o campo date no formato timestamp, escrever new Date().getTime() em inspecionar, console em algum site
routes.get('/amigos/:amigoId/livre', LivreController.index);

// rota para listagem
routes.get('/compromissos', CompromissoController.index);

// rota para agendamento
routes.post('/compromissos', CompromissoController.store);

routes.delete('/compromissos/:id', CompromissoController.delete);

// rota para listagem de agendamentos do dia do usuário
routes.get('/agenda', AgendaController.index);

// rota para lista de notificações dos compromissos do usuário
routes.get('/notificacoes', NotificacaoController.index);

// rota para marcar uma notificação como lida, recebendo o id da notificação, precisa passar o id no Insomnia
routes.put('/notificacoes/:id', NotificacaoController.update);

// rota do multer - imagem, no Insomnia criar post em multipart em vez de JSON
// single para fazer um upload por vez e não vários e o nome do campo da requisição file
routes.post('/arquivos', upload.single('arquivo'), ArquivoController.store);

export default routes;
