import Mail from '../../lib/Mail';

class EsquecerSenhaEmail {
  get key() {
    return 'EsquecerSenhaEmail';
  }

  async handle({ data }) {
    const { token, usuario } = data;

    await Mail.sendMail({
      to: `${usuario.nome} <${usuario.email}>`,
      subject: 'Alterar Senha',
      template: 'esquecerSenha',
      context: {
        token,
        usuario: usuario.nome,
      },
    });
  }
}

export default new EsquecerSenhaEmail();
