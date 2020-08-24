// ARQUIVO DE LISTAGEM DE HORÁRIOS DISPONÍVEIS NO DIA DO PRESTADOR DE SERVIÇO
import {
  startOfDay,
  endOfDay,
  setHours,
  setMinutes,
  setSeconds,
  format,
  isAfter,
} from 'date-fns';
import { Op } from 'sequelize';
import Compromisso from '../models/Compromisso';

class LivreController {
  async index(req, res) {
    const { data } = req.query;

    if (!data) {
      return res.status(400).json({ error: 'Data inválida' });
    }

    const procurarData = Number(data); // transformar em número inteiro, pode usar Number ou parseint

    const compromissos = await Compromisso.findAll({
      where: {
        usuario_id: req.params.usuarioId,
        canceled_at: null,
        data: {
          [Op.between]: [startOfDay(procurarData), endOfDay(procurarData)],
        },
      },
    });

    const agenda = [
      // horários disponíveis, poderia ter uma tabela para salvar isso, mas daria trabalho
      '08:00', // 2020-06-26 08:00
      '09:00',
      '10:00',
      '11:00',
      '12:00',
      '13:00',
      '14:00',
      '15:00',
      '16:00',
      '17:00',
      '18:00',
      '19:00',
      '20:00',
    ];

    const livre = agenda.map((time) => {
      // percore o schedule e transforma em uma variável time
      const [hour, minute] = time.split(':'); // divide hour:minute
      const value = setSeconds(
        setMinutes(setHours(procurarData, hour), minute),
        0
      );
      // setSeconds sempre 0, setMinutes pega o minute que no caso é 0, setHours pega de searchDate

      return {
        // retornar para o front end
        time,
        value: format(value, "yyyy-MM-dd'T'HH:mm:ssxxx"), // "2020-06-26T08:00:00-03:00"
        livre:
          isAfter(value, new Date()) && // ver se o horário ja passou comparado com agora
          !compromissos.find((a) => format(a.data, 'HH:mm') === time),
        // ver se o horário está disponível, ver se está nos appointments e comparar com time do schedule
      };
    });

    return res.json(livre);
  }
}

export default new LivreController();
