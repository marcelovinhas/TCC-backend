import * as Yup from 'yup';
import { startOfHour, parseISO, isBefore } from 'date-fns';
import Compromisso from '../models/Compromisso';
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
      attributes: ['id', 'data'],
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

    const compromisso = await Compromisso.create({
      usuario_id: req.usuarioId,
      data,
    });

    return res.json(compromisso);
  }
}

export default new CompromissoController();
