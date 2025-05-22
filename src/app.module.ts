import { Module } from '@nestjs/common';
import { TelegrafModule } from 'nestjs-telegraf';
import { ConfigModule } from '@nestjs/config';
import { session } from 'telegraf';

import { BotModule } from './bot/bot.module';
import { errorMiddleware } from './bot/bot.middleware';
import { AppController } from './app.controller';

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
  ],
  controllers: [AppController]
})

export class AppModule { }
