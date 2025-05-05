import { Context, MiddlewareFn } from 'telegraf';

export const errorMiddleware: MiddlewareFn<Context> = async (ctx, next) => {
    try {
        await next();
    } catch (error) {
        console.error('❌ Telegraf Middleware Error:', error);

        if ('reply' in ctx && typeof ctx.reply === 'function') {
            try {
                await ctx.reply('🚫 Виникла помилка. Спробуйте ще раз пізніше.');
            } catch (err) {
                console.error('❗ Не вдалося надіслати повідомлення про помилку:', err);
            }
        }
    }
};
