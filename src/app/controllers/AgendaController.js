// LISTAGEM PARA O USUÁRIO
import { startOfDay, endOfDay, parseISO } from 'date-fns';
import { Op } from 'sequelize';

// import Usuario from '../models/Usuario';
import Compromisso from '../models/Compromisso';

class AgendaController {
  async index(req, res) {
    const { data } = req.query;
    const parsedDate = parseISO(data);

    // ver os agendamentos do dia
    const compromissos = await Compromisso.findAll({
      where: {
        usuario_id: req.usuarioId,
        canceled_at: null,
        data: {
          [Op.between]: [startOfDay(parsedDate), endOfDay(parsedDate)],
          // 2020-07-22 00:00:00 até 2020-07-22 23:59:59
        },
      },
      order: ['data'],
    });

    return res.json({ compromissos });
  }
}

export default new AgendaController();
