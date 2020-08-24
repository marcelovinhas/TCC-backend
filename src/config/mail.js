// MANDAR EMAIL DE CANCELAMENTO PARA O PRESTADOR DE SERVIÇO - yarn add nodemailer
/*
Mailtrap para ambiente de desenvolvimento
criar conta e pegar as informações de host, port, auth (user e pass)
*/

export default {
  host: process.env.MAIL_HOST, // endereço
  port: process.env.MAIL_PORT, // porta
  secure: false, // se usa ssl ou não
  auth: {
    // autenticação do email
    user: process.env.MAIL_USER, // usuário
    pass: process.env.MAIL_PASS, // senha
  },
  default: {
    // configurações padrão
    from: 'Easy App <noreply@easyapp.com>', // remetente do email
  },
};

/*
PLATAFORMAS DE ENVIO DE EMAIL REAL
Amazon SES - a rocketseat usa esse
Mailgun
Sparkpost
Mandril só pode usar usado pra quem usa Mailchimp
*/
