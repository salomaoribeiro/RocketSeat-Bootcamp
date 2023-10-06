import * as Yup from 'yup';

import Appointment from '../models/Appointment';
import User from '../models/User';

class AppointmentController {
  async store(req, res) {
    const scheme = Yup.object().shape({
      provider_id: Yup.number().required(),
      data: Yup.date().required(),
    });

    if (!(await scheme.isValid(req.body)))
      return res.status(400).json({ error: 'Validation fails' });

    const { provider_id, data } = req.body;

    const isProvider = await User.findOne({
      where: { id: provider_id, provider: true },
    });

    if (!isProvider)
      return res
        .status(401)
        .json({ error: 'You can only create appointment with a providers' });

    const appointment = await Appointment.create({
      user_id: req.userId,
      provider_id,
      data,
    });

    return res.json({ appointment });
  }
}

export default new AppointmentController();
