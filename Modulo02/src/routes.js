import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import FileController from './app/controllers/FileController';
import SessionController from './app/controllers/SessionController';
import ScheduleController from './app/controllers/ScheduleController';
import ProviderController from './app/controllers/ProviderController';
import AppointmentController from './app/controllers/AppointmentController';
import NotificationController from './app/controllers/NotificationController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/session', SessionController.store);

// actvating middlewares
routes.use(authMiddleware);

routes.post('/users', UserController.store);
routes.put('/users', UserController.update);
routes.get('/users', UserController.index);

routes.post('/providers', ProviderController.index);

routes.post('/files', upload.single('file'), FileController.store);

routes.get('/appointments', AppointmentController.index);
routes.post('/appointments', AppointmentController.store);

routes.get('/notifications', NotificationController.index);

routes.get('/schedule', ScheduleController.index);

export default routes;
