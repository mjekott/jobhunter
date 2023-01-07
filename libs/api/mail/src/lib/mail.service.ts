import { MailerService } from '@nestjs-modules/mailer'
import { Injectable } from '@nestjs/common'

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendForgotPassword(email: string, code: string) {
    await this.mailerService.sendMail({
      to: email,
      from: '"Support Team" <job-hunter@example.com>',
      subject: 'Forgot Password',

      template: './forgotPassword',
      context: {
        email,
        code,
      },
    })
  }
}
