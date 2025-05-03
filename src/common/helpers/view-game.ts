import { Markup } from 'telegraf';

import localse from "../../common/locales/text.json";

export const viewGame = async ({ games = [], ctx }: { games: any[], ctx: any }) => {
    if (!games?.length) {
        await ctx.reply(localse.sorryGamesDontFind, {
            reply_markup: {
                inline_keyboard: [
                    [{
                        text: localse.backToCity,
                        callback_data: `back_to_city`
                    }]
                ]
            }
        });
    }

    if (games?.length) {
        try {
            games.forEach(async (game: any) => {
                const key = `register_${game.id}`;

                await ctx.replyWithPhoto(
                    { url: game.image },
                    {
                        caption: game.description,
                        parse_mode: 'HTML',
                        reply_markup: Markup.inlineKeyboard([
                            [Markup.button.callback(localse.registration, key)]
                        ]).reply_markup
                    }
                );
            });
        } catch (error) {
            console.error("Не вдалось надіслати гру:", error);
            await ctx.reply(localse.errors.viewGame);
        }
    }
}