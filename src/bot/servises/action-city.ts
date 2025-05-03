import { Injectable } from "@nestjs/common";
import { Context } from 'telegraf';

import { CityService } from "src/city/city.service";
import { GameService } from "src/game/game.service";
import { viewGame } from "src/common/helpers/view-game";
import { viewButtonCity } from "src/common/helpers/view-button";

import localse from "../../common/locales/text.json";


@Injectable()
export class ActionCityServise {
    constructor(
        private readonly gameServise: GameService,
        private readonly cityServise: CityService
    ) { }

    async actionCity(ctx: any) {
        const callbackData = ctx.update?.callback_query?.data;

        if (!callbackData) {
            console.error('Не отримав cityId');
            await ctx.reply(localse.errors.actionCity);

            return;
        }

        const cityId = callbackData.split('_')[1];

        try {
            const games = await this.gameServise.getGameByCityId(+cityId);
            viewGame({ games, ctx });
        } catch (error) {
            console.error('Помилка при завантаженні міст:', error);
            await ctx.reply(localse.errors.writeGame);
        }

        await ctx.answerCbQuery();
    }

    async backToCityList(ctx: Context) {
        try {
            const cities = await this.cityServise.getCities();
            const buttons = viewButtonCity({ cities })

            await ctx.reply(localse.chooseCity, {
                reply_markup: {
                    inline_keyboard: buttons
                }
            });
        } catch (error) {
            console.error('Помилка при завантаженні міст по кнопці back:', error);

            await ctx.reply(localse.errors.getCities);
        }

        await ctx.answerCbQuery();
    }
}