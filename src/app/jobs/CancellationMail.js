import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class CancellationMail {
  // get key() usa para retornar uma variável sem chamar o método, sem criar constructor
  // exemplo: import CancellationMail from '..', poderia usar CancellationMail.key()
  get key() {
    return 'CancellationMail'; // precisa retonar uma chave única
  }

  async handle({ data }) {
    // método que aplica a tarefa que precisa executar quando determinada fila
    const { compromisso } = data; // data é a informação para o envio de email

    await Mail.sendMail({
      to: `${compromisso.amigo.nome} <${compromisso.amigo.email}>`, // para quem vai enviar o email
      subject: 'Compromisso cancelado',
      template: 'cancellation', // arquivo do template
      context: {
        // enviar as variáveis que o template está esperando
        amigo: compromisso.amigo.nome,
        usuario: compromisso.usuario.nome,
        assunto: compromisso.assunto,
        data: format(
          parseISO(compromisso.data),
          "'dia' dd 'de' MMMM', às' H:mm'h'",
          {
            locale: pt,
          }
        ),
      },
    });
  }
}

export default new CancellationMail();
