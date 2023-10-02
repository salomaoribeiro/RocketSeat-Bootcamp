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
    return res.json({ Ok: true });
  }
}

export default new UserController();
