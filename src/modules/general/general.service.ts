import { Injectable } from '@nestjs/common';
import { InjectBot } from 'nestjs-telegraf';
import { Telegraf } from 'telegraf';

@Injectable()
export class GeneralService {
  constructor(
    @InjectBot() private readonly bot: Telegraf
  ) { }

  async sendMessage(dataMessage: {
    chatId: string | number;
    text: string;
    replyToMessageId?: number | string;
  }) {
    const { chatId, text, replyToMessageId } = dataMessage;

    const options = {
      reply_to_message_id: replyToMessageId ? Number(replyToMessageId) : undefined,
      parse_mode: 'HTML',
    } as any;

    return this.bot.telegram.sendMessage(chatId, text, options);
  }
}
