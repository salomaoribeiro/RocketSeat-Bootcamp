import User from '../models/User';
import File from '../models/File';

class ProviderController {
  async index(req, res) {
    const users = await User.findAll({
      where: { provider: true },
      attributes: ['id', 'nome', 'email', 'avatar_id'],
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['name', 'path', 'url'],
        },
      ],
    });

    res.status(400).json({ users });
  }
}

export default new ProviderController();
