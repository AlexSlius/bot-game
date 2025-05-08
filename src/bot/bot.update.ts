import { Update, Start, Ctx, Action, Message, On } from 'nestjs-telegraf';
import { Context } from 'telegraf';

import { StartServise } from './servises/start';
import { ActionCityServise } from './servises/action-city';
import { ActionGameServise } from './servises/action-game';

import localse from "../common/locales/text.json";
import { MyContext } from 'src/common/types/scene-context';


@Update()
export class BotUpdate {
    constructor(
        private readonly startServis: StartServise,
        private readonly actionCityServise: ActionCityServise,
        private readonly actionGameServise: ActionGameServise,
    ) { }

    // start bot
    @Start()
    async start(@Ctx() ctx: any) {
        await this.startServis.start(ctx);
    }

    // click around the city from list
    @Action(/city_\d+/)
    onCitySelect(@Ctx() ctx: Context) {
        this.actionCityServise.actionCity(ctx)
    }

    // press the button go back to cities
    @Action('back_to_city')
    onBackToCity(@Ctx() ctx: Context) {
        this.actionCityServise.backToCityList(ctx)
    }

    // registration game
    @Action(/register_\d+/)
    async onGameRegister(@Ctx() ctx: MyContext) {
        this.actionGameServise.gameRegister(ctx);
    }

    // registration game
    @Action(/rezerv_\d+/)
    onRezervGame(@Ctx() ctx: Context) {
        this.actionGameServise.rezervbGame(ctx);
    }

    // share contact
    @On('contact')
    async onContact(@Ctx() ctx: any) {
        const purpose = ctx?.session?.contactPurpose;
        const contact = ctx.message.contact;

        if (!purpose || !contact) {
            console.error('Проблема з отриманням контактів');
            await ctx.reply(localse.errors.reserv);

            return;
        }

        const id = purpose.split('_')[1];

        if (purpose.startsWith('rezervGame')) {
            this.actionGameServise.sendRezervbGame(ctx, +id, contact);
        }
    }

    @On('message')
    async onMessage(@Ctx() ctx: any) {
        const text = ctx.message.text;

        if (text === localse.editQuantity) {
            await ctx.scene.enter('update_quantity_scene');
        } else if (text === localse.question) {
            await ctx.scene.enter('question_scene');
        } else if (text === localse.cancel) {
            await ctx.scene.enter('cansel_game_scene');
        } else if (text === localse.cities) {
            await this.startServis.start(ctx, false);
        } else {
            await ctx.reply(localse.escusmmyDo);
        }
    }
}