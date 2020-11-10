// ARQUIVO DE NOTIFICAÇÃO DE COMPROMISSOS MARCADOS PELO USUÁRIO

// import Usuario from '../models/Usuario';
import Notificacao from '../schemas/Notificacao';

class NotificacaoController {
  async index(req, res) {
    // const checkisProvider = await Usuario.findOne({
    //   where: { id: req.usuarioId, amigo: true }, // verifica se o usuário logado é um prestador de serviço
    // });

    // if (!checkisProvider) {
    //   // se não for prestador de serviço dá erro
    //   return res
    //     .status(401)
    //     .json({ error: 'Only providers can load notifications' });
    // }

    const notificacoes = await Notificacao.find({
      usuario: req.usuarioId, // usuário logado
    })
      .sort({ createdAt: 'desc' }) // ordena por createdAt por ordem decrescente, a ultima criada fica em cima
      .limit(20); // limita 20 itens por página
    return res.json(notificacoes);
  }

  async update(req, res) {
    const notificacoes = await Notificacao.findByIdAndUpdate(
      // encontra o registro e atualiza ao mesmo tempo
      req.params.id, // primeiro parâmetro id que vem da rota
      { read: true }, // segundo parâmetro é o que deseja atualizar dentro do objeto
      { new: true } // depois de atualizar retorna a nova notificação atualizada para listar o usuário
    );

    return res.json(notificacoes);
  }
}

export default new NotificacaoController();
