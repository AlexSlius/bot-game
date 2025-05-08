import { Injectable } from "@nestjs/common";

import { CityService } from "src/city/city.service";
import { viewButtonCity } from "src/common/helpers/view-button";
import { sendMainMenu } from 'src/common/helpers/view-button';

import localse from "../../common/locales/text.json";


@Injectable()
export class StartServise {
    constructor(private readonly cityServise: CityService) { }

    async start(ctx: any, isFirst = true) {
        if (isFirst)
            await sendMainMenu(ctx, localse.hello);

        try {
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