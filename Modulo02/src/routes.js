import { Router } from 'express';

const routes = new Router();

routes.get('/', (req, res) => res.json({ message: 'servidor ligado' }));

export default routes;
