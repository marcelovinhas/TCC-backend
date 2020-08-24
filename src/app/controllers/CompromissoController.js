import * as Yup from 'yup';
import { startOfHour, parseISO, isBefore, format, subHours } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Usuario from '../models/Usuario';
import Compromisso from '../models/Compromisso';
import Notificacao from '../schemas/Notificacao';

import CancellationMail from '../jobs/CancellationMail';
import Queue from '../../lib/Queue';
// import Arquivo from '../models/Arquivo';

class CompromissoController {
  async index(req, res) {
    // listagem de provedores de serviço
    const { pagina = 1 } = req.query; // query é o parâmetro anexado na url (olocado no query do Insomnia)

    const compromissos = await Compromisso.findAll({
      where: { usuario_id: req.usuarioId, canceled_at: null },
      order: ['data'],

      limit: 5, // no máximo 20 agendamentos por página
      offset: (pagina - 1) * 5, // se estiver na primeira página (1-1)*20 = 0 não pula registros
      attributes: ['id', 'data', 'passado', 'cancelavel'],
      // include: [
      //   // para retornar o avatar
      //   {
      //     model: Arquivo,
      //     as: 'avatar',
      //     attributes: ['id', 'path', 'url'], // path é obrigatório pois File.js depende de path
      //   },
      // ], // para retornar para o Imsomnia apenas id e data do agendamento
    }); // lista os agendamentos que não foram cancelados

    return res.json(compromissos);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      usuario_id: Yup.number(),
      data: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha na validação' });
    }

    const { data } = req.body;

    // startOfHour pega o início da hora, se colocar 19:30 ele transforma em 19:00
    // parseIso transforma a string de data do Insomnia objeto date para o js
    const hourStart = startOfHour(parseISO(data));

    // verifica se a data do agendamento desejado com a data atual, ve se a data já passou, é antiga
    if (isBefore(hourStart, new Date())) {
      return res.status(400).json({ error: 'A data já passou.' });
    }

    // verifica se a data que o usuário deseja marcar está livre, com intervalo de 1h
    const checkHorario = await Compromisso.findOne({
      where: {
        canceled_at: null, // verifica se o agendamento estiver cancelado
        data: hourStart, // verifica se a data digitada não é quebrada
      },
    });

    // se a data não estiver vaga
    if (checkHorario) {
      return res
        .status(400)
        .json({ error: 'Há outro compromisso já marcado nesse horário.' });
    }

    // se passou pela verificação cria o agendamento
    const compromisso = await Compromisso.create({
      usuario_id: req.usuarioId, // pega o user de autenticação em auth.js
      data: hourStart, // verifica se a data digitada não é quebrada
    });

    const usuario = await Usuario.findByPk(req.usuarioId); // variável para colocar na notificação ${user.name}
    const dataFormatada = format(
      // para definir formato de data
      hourStart, // data que quer formatar
      "'dia' dd 'de' MMMM', às' H:mm'h'", // formatação o que está em aspas simples '' sairá escrito literalmente
      { locale: pt }
    );

    await Notificacao.create({
      conteudo: `${usuario.nome} marcou um novo compromisso ${dataFormatada}.`,
    });

    return res.json(compromisso);
  }

  async delete(req, res) {
    const compromisso = await Compromisso.findByPk(req.params.id, {
      include: [
        // incluir as informações do prestador de serviço para envio de email
        {
          model: Usuario,
          as: 'usuario',
          attributes: ['nome', 'email'], // informações úteis para o email
        },
      ],
    }); // busca os dados do agendamento

    if (compromisso.usuario_id !== req.usuarioId) {
      // verificar se o id que quer cancelar o agendamento, é o dono do agendamento
      return res
        .status(401)
        .json({ error: 'Você não pode cancelar esse evento.' });
    }

    // subHours para verificar se o usuário deseja cancelar o agendaento pelo menos duas horas antes do horário marcado
    const dateWithSub = subHours(compromisso.data, 2);
    // o campo de data no banco de dados já vem no formato data, não precisa USAR parseISO

    // exemplo: agendamento marcado para as 13:00, dateWithSub: 11h, horário do computador é 11:25h
    // no exemplo não pode mais cancelar o agendamento
    if (isBefore(dateWithSub, new Date())) {
      return res.status(401).json({
        error:
          'Faltam menos de duas horas para o evento, você não pode mais cancelar.',
      });
    }

    compromisso.canceled_at = new Date();

    await compromisso.save();

    /*
    o tempo de resposta da requisição de cancelamento demora muito mais que os outros
    é possível tirar o await para diminuir, mas caso haja algum erro nessa parte não saberiamos
    pois a resposta ja teria retornado, a melhor forma de melhorar o tempo é usar filas ou background jobs
    tipos de serviço que executam em segundo plano, para coisas que levam mais tempo
    para isso usa banco redis que é um banco chave valor, não relacional mas sem schema, apenas chave valor
    por isso, é mais performático que mongodb, docker run --name redisbarber -p 6379:6379 -d -t redis:alpine
    esse trecho abaixo foi passado para CancellationMail.js
    await Mail.sendMail({
      to: `${appointment.provider.name} <${appointment.provider.email}>`, //para quem vai enviar o email
      subject: 'Agendamento cancelado',
      template: 'cancellation', //arquivo do template
      context: { //enviar as variáveis que o template está esperando
        provider: appointment.provider.name,
        user: appointment.user.name,
        date: format(appointment.date, "'dia' dd 'de' MMMM', às' H:mm'h'", {
          locale: pt,
        }),
      },
    });
    */

    await Queue.add(CancellationMail.key, {
      compromisso,
    });

    return res.json(compromisso);
  }
}

export default new CompromissoController();
