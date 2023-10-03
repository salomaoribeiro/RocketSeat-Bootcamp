import User from '../models/User';

class UserController {
  async store(req, res) {
    const usuarioExiste = await User.findOne({
      where: { email: req.body.email },
    });

    if (usuarioExiste)
      return res.status(400).json({
        error: 'user already exists',
      });

    const { id, nome, email, provider } = await User.create(req.body);

    return res.json({
      id,
      nome,
      email,
      provider,
    });
  }

  async update(req, res) {
    const { email, oldPassword } = req.body;

    const user = await User.findByPk(req.userId);

    if (user && email !== user.email) {
      const userExist = await User.findOne({
        where: { email },
      });

      if (userExist)
        return res.status(400).json({ error: 'User alread exists' });
    }

    if (oldPassword && !(await user.checkPassword(oldPassword)))
      return res.status(401).json({
        error: 'Password does not match',
      });

    const { id, nome, provider } = await user.update(req.body);

    return res.json({
      id,
      nome,
      email,
      provider,
    });
  }
}

export default new UserController();
