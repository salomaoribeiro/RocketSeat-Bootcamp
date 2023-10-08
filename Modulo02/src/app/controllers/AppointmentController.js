import * as Yup from 'yup';
import { startOfHour, parseISO, isBefore, format } from 'date-fns';
import pt from 'date-fns/locale/pt';

import File from '../models/File';
import User from '../models/User';
import Appointment from '../models/Appointment';
import Notification from '../schemas/Notification';

class AppointmentController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const appointments = await Appointment.findAll({
      where: {
        user_id: req.userId,
        canceled_at: null,
      },
      attributes: ['id', 'data'],
      order: ['data'],
      limit: 20,
      offset: (page - 1) * 20,
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['id', 'nome'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['name', 'path', 'url'],
            },
          ],
        },
      ],
    });

    res.json({ appointments });
  }

  async store(req, res) {
    const scheme = Yup.object().shape({
      provider_id: Yup.number().required(),
      data: Yup.date().required(),
    });

    if (!(await scheme.isValid(req.body)))
      return res.status(400).json({ error: 'Validation fails' });

    const { provider_id, data } = req.body;

    if (provider_id == req.userId)
      return res
        .status(400)
        .json({ error: "You can't make an appointment with yourself" });

    const isProvider = await User.findOne({
      where: { id: provider_id, provider: true },
    });

    if (!isProvider)
      return res
        .status(401)
        .json({ error: 'You can only create appointment with a providers' });

    const hourStart = startOfHour(parseISO(data));

    if (isBefore(hourStart, new Date()))
      return res.status(400).json({ error: 'Past dates are not permitted' });

    const checkAvailability = await Appointment.findOne({
      where: {
        provider_id,
        canceled_at: null,
        data: hourStart,
      },
    });

    if (checkAvailability)
      return res.status(400).json({ error: 'Appointment date is not available' });

    const appointment = await Appointment.create({
      user_id: req.userId,
      provider_id,
      data,
    });

    const user = await User.findByPk(req.userId);
    const formatedDate = format(
      hourStart,
      "'dia' dd 'de' MMMM', às' hh:mm'h'",
      { locale: pt }
    );

    // Notify appointment provider
    await await Notification.create({
      content: `Novo agendamento de ${user.nome} para ${formatedDate}`,
      user: provider_id,
    });

    return res.json({ appointment });
  }
}

export default new AppointmentController();
