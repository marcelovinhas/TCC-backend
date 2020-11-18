// LISTAGEM PARA O USUÁRIO
import { startOfDay, endOfDay, parseISO } from 'date-fns';
import { Op } from 'sequelize';

import Compromisso from '../models/Compromisso';
import Usuario from '../models/Usuario';

class AgendaController {
  async index(req, res) {
    const checarAmigo = await Usuario.findOne({
      where: { id: req.usuarioId },
    });

    if (!checarAmigo) {
      return res.status(401).json({ error: 'Vocês não são amigos' });
    }

    const { data } = req.query;
    const parsedDate = parseISO(data);

    // ver os agendamentos do dia
    const agenda = await Compromisso.findAll({
      where: {
        amigo_id: req.usuarioId,
        canceled_at: null,
        data: {
          [Op.between]: [startOfDay(parsedDate), endOfDay(parsedDate)],
          // 2020-07-22 00:00:00 até 2020-07-22 23:59:59
        },
      },
      include: [
        {
          model: Usuario,
          as: 'usuario',
          attributes: ['nome'],
        },
      ],
      order: ['data'],
    });

    return res.json(agenda);
  }
}

export default new AgendaController();
