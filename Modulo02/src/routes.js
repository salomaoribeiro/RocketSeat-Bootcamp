import { Router } from 'express';

import User from './app/models/User';

const routes = new Router();

routes.get('/', async (req, res) => {
  const user = await User.update({
    nome: 'salomao',
    email: 'salomaomdm@gmail.com',
    password_hash: '123',
    provider: true,
  });

  return res.json(user);
});

export default routes;
