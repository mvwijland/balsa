import nodemailer from 'nodemailer';
import hbs from 'nodemailer-express-handlebars';
import {
  SMTP_SERVICE_DEBUG,
  SMTP_SERVICE_HOST,
  SMTP_SERVICE_PORT,
  SMTP_SERVICE_SECURE,
  SMTP_SERVICE_USER_NAME,
  SMTP_SERVICE_USER_PASSWORD,
} from '../constants';

export default class BaseMailer {
  constructor() {}

  getTransporterOptions() {
    return {
      host: SMTP_SERVICE_HOST,
      port: SMTP_SERVICE_PORT,
      secure: SMTP_SERVICE_SECURE,
      debug: SMTP_SERVICE_DEBUG,
      auth: {
        user: SMTP_SERVICE_USER_NAME,
        pass: SMTP_SERVICE_USER_PASSWORD,
      },
    };
  }

  getTransporter() {
    const transporter = nodemailer.createTransport(this.getTransporterOptions());
    transporter.use(
      'compile',
      hbs({
        viewEngine: {
          extName: '.html',
          partialsDir: 'templates/email/partials',
          layoutsDir: 'templates/email/layouts',
          defaultLayout: 'base.html',
        },
        viewPath: 'templates/email',
        extName: '.html',
      }),
    );

    return transporter;
  }

  sendMail(from, to, subject, template, context) {
    const transport = this.getTransporter();
    transport.sendMail({ from, to, subject, template, context }, (error, info) => {
      if (error) {
        console.log('Error', error, template);
      }
      console.log('Info', info, template);
    });
  }
}
