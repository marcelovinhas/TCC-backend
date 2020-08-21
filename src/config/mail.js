// MANDAR EMAIL DE CANCELAMENTO PARA O PRESTADOR DE SERVIÇO - yarn add nodemailer
/*
Mailtrap para ambiente de desenvolvimento
criar conta e pegar as informações de host, port, auth (user e pass)
*/

export default {
  host: 'smtp.mailtrap.io', // endereço
  port: '2525', // porta
  secure: false, // se usa ssl ou não
  auth: {
    // autenticação do email
    user: 'd3e0517cb1dfff', // usuário
    pass: 'a07d7e2fbcd9c6', // senha
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
