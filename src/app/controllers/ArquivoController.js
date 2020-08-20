import Arquivo from '../models/Arquivo';

class ArquivoController {
  async store(req, res) {
    const { originalname: nome, filename: path } = req.arquivo;
    // originalname = nome do arquivo salvo na máquina do usuário
    // filename = token único
    // para ver isso na rota do post file colocar return res.json(req.file);

    const arquivo = await Arquivo.create({
      nome,
      path,
    });
    return res.json(arquivo);
  }
}

/*
precisa agora colocar a coluna de imagem no banco de dados do usuário, mas como a migration já aconteceu
é melhor não adicionar uma coluna na migration já criada, pois pode dar erro por causa de conexões
é melhor criar outra migration (yarn sequelize migration:create --name=add-avatar-field-to-users)
*/

export default new ArquivoController();
