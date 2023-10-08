import * as Yup from 'yup';

import User from '../models/User';

class UserController {
  async index(_, res) {
    const allUsers = await User.findAll();
    res.json({ allUsers });
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      nome: Yup.string().required(),
      email: Yup.string().email().required(),
      password: Yup.string().required().min(6),
    });

    if (!(await schema.isValid(req.body)))
      return res.status(400).json({ error: 'Validation fails' });

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
    const schema = Yup.object().shape({
      nome: Yup.string(),
      email: Yup.string().email(),
      oldPassword: Yup.string().min(6),
      password: Yup.string()
        .min(6)
        .when('oldPassword', (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
      confirmPassword: Yup.string().when('password', (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field
      ),
    });

    if (!(await schema.isValid(req.body)))
      return res.status(401).json({ error: 'Validation fails' });

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
