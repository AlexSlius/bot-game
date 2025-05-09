import { Injectable } from "@nestjs/common";

import { CityService } from "src/city/city.service";
import { viewButtonCity } from "src/common/helpers/view-button";
import { sendMainMenu } from 'src/common/helpers/view-button';
import { GameService } from "src/game/game.service";

import { divide } from "src/common/helpers/help-command";
import { viewGame } from "src/common/helpers/view-game";

import localse from "../../common/locales/text.json";


@Injectable()
export class StartServise {
    constructor(
        private readonly cityServise: CityService,
        private readonly gameServise: GameService,
    ) { }

    async start(ctx: any, isFirst = true) {
        try {
            let { city = null, game = null } = divide(ctx.update.message.text);

            if (city) {
                const getCity = await this.cityServise.getCityById(city);

                if (getCity?.id) {
                    await sendMainMenu(ctx, localse.hello);
                    await ctx.reply(`${localse.gamesInTheCity} ${getCity.name}`);

                    const games = await this.gameServise.getGameByCityId(getCity.id);
                    await viewGame({ games, ctx });

                    return;
                }
            }

            if (isFirst)
                await sendMainMenu(ctx, localse.hello);

            const cities = await this.cityServise.getCities();
            const buttons = viewButtonCity({ cities })

            await ctx.reply(localse.chooseCity, {
                reply_markup: {
                    inline_keyboard: buttons
                }
            });
        } catch (error) {
            console.error('Помилка при завантаженні міст:', error);

            await ctx.reply(localse.errors.getCities);
        }
    }
}