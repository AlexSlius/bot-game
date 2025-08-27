import { Module } from '@nestjs/common';
import { TelegrafModule } from 'nestjs-telegraf';
import { ConfigModule } from '@nestjs/config';
import { session } from 'telegraf';

import { BotModule } from './bot/bot.module';
import { errorMiddleware } from './bot/bot.middleware';
import { AppController } from './app.controller';
import { GeneralModule } from './modules/general/general.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TelegrafModule.forRoot({
      token: `${process.env.BOT_TOKEN}`,
      middlewares: [session(), errorMiddleware]
    }),
    BotModule,
    GeneralModule,
  ],
  controllers: [AppController]
})

export class AppModule { }
