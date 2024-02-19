import nodemailer from 'nodemailer';

export class EmailService {
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL_FROM,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  async sendMail(to: string, subject: string, html: string): Promise<boolean> {
    try {
      this.transporter.sendMail({
        from: process.env.MAIL_FROM,
        to,
        subject,
        html,
      });
      return true;
    } catch (error) {}
  }
}
