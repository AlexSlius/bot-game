import { Markup } from 'telegraf';

import localse from "../../common/locales/text.json";

export const viewButtonCity = ({ cities, key = 'city' }) => {
    const buttons: { text: string; callback_data: string }[][] = [];

    for (let i = 0; i < cities.length; i += 2) {
        buttons.push(
            cities.slice(i, i + 2).map((city: { id: number, name: string }) => ({
                text: city.name,
                callback_data: `${key}_${city.id}`
            }))
        )
    }

    return buttons;
}

export const viewButtonGame = ({ games, key = 'quantity', keqBack = "back_to_city_qun" }) => {
    const buttons: { text: string; callback_data: string }[][] = [];

    for (let i = 0; i < games.length; i += 2) {
        buttons.push(
            games.slice(i, i + 2).map((game: { id: number, name: string }) => ({
                text: game.name,
                callback_data: `${key}_${game.id}`
            }))
        )
    }
    return buttons;
}

export const sendMainMenu = async (ctx: any, text = "...") => {
    return ctx.reply(text, Markup.keyboard([
        [localse.editQuantity, localse.question],
        [localse.cancel, localse.cities],
    ])
        .resize()
        .oneTime()
    );
};
