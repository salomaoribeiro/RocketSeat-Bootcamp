import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt-BR';

import Mail from '../../lib/Mail';

class CancellationMail {
  get key() {
    return 'CancellationMail ';
  }

  async handle({ data }) {
    const { appointment } = data;

    await Mail.sendMail({
      to: `${appointment.provider.nome} <${appointment.provider.email}>`,
      subject: 'Agendamento cancelado',
      template: 'cancellation',
      context: {
        provider: appointment.provider.nome,
        user: appointment.user.nome,
        data: format(parseIso(appointment.date), "dd 'de' MMMM 'às' H:mm:'h'", {
          locale: pt,
        }),
      },
    });
  }
}

export default new CancellationMail();
