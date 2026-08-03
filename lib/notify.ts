import nodemailer from 'nodemailer';
import Twilio from 'twilio';

type NotifyInput = {
  ownerEmail: string;
  customerEmail: string;
  customerPhone: string;
  customerName: string;
  message: string;
  notifyMethod: 'email' | 'sms';
};

export async function sendNotifications(input: NotifyInput) {
  const results: Array<{ channel: string; ok: boolean; message: string }> = [];

  const ownerMessage = `New tote order for ${input.customerName}.\n\n${input.message}`;
  const customerMessage = `Your tote order was received.\n\n${input.message}`;

  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS && process.env.SMTP_FROM) {
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 587),
        secure: String(process.env.SMTP_PORT || '587') === '465',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });

      await transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: input.ownerEmail,
        subject: 'New Moving Tote Order',
        text: ownerMessage
      });

      if (input.notifyMethod === 'email') {
        await transporter.sendMail({
          from: process.env.SMTP_FROM,
          to: input.customerEmail,
          subject: 'Your Moving Tote Order',
          text: customerMessage
        });
      }

      results.push({ channel: 'email', ok: true, message: 'Email sent via SMTP' });
    } catch (error) {
      results.push({ channel: 'email', ok: false, message: `Email failed: ${(error as Error).message}` });
    }
  } else {
    results.push({
      channel: 'email',
      ok: false,
      message: 'SMTP env not configured; notification stored in app only'
    });
  }

  if (
    input.notifyMethod === 'sms' &&
    process.env.TWILIO_ACCOUNT_SID &&
    process.env.TWILIO_AUTH_TOKEN &&
    process.env.TWILIO_FROM
  ) {
    try {
      const client = Twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
      await client.messages.create({
        body: customerMessage,
        from: process.env.TWILIO_FROM,
        to: input.customerPhone
      });
      results.push({ channel: 'sms', ok: true, message: 'SMS sent via Twilio' });
    } catch (error) {
      results.push({ channel: 'sms', ok: false, message: `SMS failed: ${(error as Error).message}` });
    }
  } else if (input.notifyMethod === 'sms') {
    results.push({
      channel: 'sms',
      ok: false,
      message: 'Twilio env not configured; notification stored in app only'
    });
  }

  return results;
}
