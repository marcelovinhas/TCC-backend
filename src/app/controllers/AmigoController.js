import Usuario from '../models/Usuario';
// import File from '../models/File';

class AmigoController {
  async index(req, res) {
    const amigos = await Usuario.findAll({
      where: { amigo: true },
      attributes: ['id', 'nome', 'email'],
      // include: [
      //   {
      //     model: File,
      //     as: 'avatar',
      //     attributes: ['name', 'path', 'url'],
      //   },
      // ],
    });

    return res.json(amigos);
  }

  async sozinho(req, res) {
    const amigos = await Usuario.findAll({
      where: { amigo: false },
      attributes: ['id', 'nome', 'email'],
      // include: [
      //   {
      //     model: File,
      //     as: 'avatar',
      //     attributes: ['name', 'path', 'url'],
      //   },
      // ],
    });

    return res.json(amigos);
  }
}

export default new AmigoController();
