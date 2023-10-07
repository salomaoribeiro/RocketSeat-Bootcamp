import { startOfDay, endOfDay, parseISO } from 'date-fns';
import { Op } from 'sequelize';

import User from '../models/User';
import Appointment from '../models/Appointment';

class ScheduleController {
  async index(req, res) {
    const checkUserProvider = await User.findOne({
      where: {
        id: req.userId,
        provider: true,
      },
    });

    if (!checkUserProvider)
      return res.status(401).json({ error: 'User is not a provider' });

    const { data } = req.query;
    const parseDate = parseISO(data);

    if (!parseDate)
      return res.status(401).json({ error: 'Date is not informed or inválid' });

    const appointment = await Appointment.findAll({
      where: {
        provider_id: req.userId,
        canceled_at: null,
        data: {
          [Op.between]: [startOfDay(parseDate), endOfDay(parseDate)],
        },
      },
      order: ['data'],
    });

    return res.json({ appointment });
  }
}

export default new ScheduleController();
