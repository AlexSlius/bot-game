import { Injectable } from "@nestjs/common";

import { GameService } from "src/game/game.service";

import localse from "../../common/locales/text.json";
import { TeamService } from "src/team/team.service";
import { sendMainMenu } from "src/common/helpers/view-button";

@Injectable()
export class ActionGameServise {
    constructor(
        private readonly gameServise: GameService,
        private readonly teamServise: TeamService,
    ) { }

    async gameRegister(ctx: any) {
        const callbackData = ctx.update?.callback_query?.data;

        if (!callbackData) {
            console.error('Не отримав register_id');
            await ctx.reply(localse.errors.actionCity);

            return;
        }

        try {
            const chatId = ctx.update.callback_query.from.id;
            const gameId = callbackData.split('_')[1];

            const registerTeam = await this.teamServise.findFirst(+gameId, chatId);

            if (registerTeam?.id) {
                await ctx.answerCbQuery();

                await ctx.reply(localse.youAreRegistered, {
                    reply_markup: {
                        inline_keyboard: [
                            [{
                                text: localse.backToCity,
                                callback_data: `back_to_city`
                            }]
                        ]
                    }
                });

                return;
            }

            const game = await this.gameServise.getGameById(+gameId);

            if (!game.id) {
                await ctx.reply(localse.didntFindGame);
            }

            // rezerv
            if (game.statusId === 3) {
                await ctx.reply(localse.rezerv, {
                    reply_markup: {
                        inline_keyboard: [
                            [{
                                text: localse.leaveRequest,
                                callback_data: `rezerv_${game.id}`
                            }]
                        ]
                    }
                });
            }

            // active
            if (game.statusId === 1) {
                await ctx.scene.leave('register_scene');
                await ctx.scene.enter('register_scene', { gameId, cityId: game.cityId });
            }

            await ctx.answerCbQuery();
        } catch (error) {
            console.error('Помилка на вибору гри:', error);
            await ctx.reply(localse.errors.pressTheButtonRegisGame);
        }
    }

    async rezervbGame(ctx: any) {
        const callbackData = ctx.update?.callback_query?.data;
        const chatId = ctx.update.callback_query.from.id;

        if (!callbackData) {
            console.error('Не отримав rezerv_id');
            await ctx.reply(localse.errors.reserv);

            return;
        }

        const gameId = callbackData.split('_')[1];
        const registerTeam = await this.teamServise.findFirst(+gameId, chatId);

        if (registerTeam?.id) {
            await ctx.answerCbQuery();
            await ctx.reply(localse.youAreReserved);

            return;
        }

        ctx.session.contactPurpose = `rezervGame_${gameId}`;
        await ctx.reply(localse.sharePhone, {
            reply_markup: {
                keyboard: [
                    [
                        {
                            text: localse.shareContact,
                            request_contact: true
                        }
                    ]
                ],
                resize_keyboard: true,
                one_time_keyboard: true
            }
        });

        await ctx.answerCbQuery();
    }

    async sendRezervbGame(ctx: any, id: number, contact: { phone_number: string, first_name: string, user_id: number }) {
        const chatId = `${ctx.update?.callback_query?.from?.id || ctx.update?.message.from.id}`;

        if (!chatId) {
            console.error("Не отримав chatId в sendRezervbGame");
            await ctx.reply(localse.errors.reserv);

            return;
        }

        const game = await this.gameServise.getGameById(id);

        if (!game?.id) {
            console.error('Не отримав гру для резерва');
            await ctx.reply(localse.didntFindGame);

            return;
        }

        try {
            const username = `${ctx.update?.callback_query?.from?.username || ctx.update?.message.from.username}`;

            const resCreate = await this.teamServise.createTeam({
                name: '-',
                captain: contact.first_name,
                phone: `${contact.phone_number}`,
                chatId: `${chatId}`,
                nickname: `@${username}`,
                gameId: game.id,
                cityId: game.cityId,
                players: 0,
                playersNew: 0,
                statusId: 6,
                wish: '',
                note: '',
            });

            if (resCreate?.data?.isAdd) {
                await ctx.reply(localse.successfullReserv);
                sendMainMenu(ctx);
            } else {
                await ctx.reply(localse.errors.reserv);
                sendMainMenu(ctx);
            }
        } catch (error) {
            console.error("Не вийшло зареєструвати заявку")
            await ctx.reply(localse.errors.reserv);

            return
        }
    }
}