import { Global, Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';

import { SES } from '@aws-sdk/client-ses';
import { ApplicationConfig } from '@config/application.config';
import { AxiosService } from '@share/module/axios/axios.service';
import { AppLogger } from '@share/module/logger/app-logger.config';
import { MailService } from '@share/module/mail/mail.service';

@Global()
@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: async () => ({
        transport: {
          SES: new SES({
            apiVersion: '2010-12-01',
            region: ApplicationConfig.aws.region,
          }),
        },
        template: {
          dir: join(__dirname, 'mail', 'template'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
  ],
  providers: [AxiosService, AppLogger, MailService],
  exports: [AxiosService, AppLogger, MailService],
})
export class ShareModule {}
