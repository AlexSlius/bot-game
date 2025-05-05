import { Injectable } from '@nestjs/common';
import { Markup } from 'telegraf';
import { Action, Ctx, Wizard, WizardStep } from 'nestjs-telegraf';

import { StartServise } from 'src/bot/servises/start';
import { CityService } from "src/city/city.service";
import { QuestionService } from 'src/question/question.service';
import { sendMainMenu } from 'src/common/helpers/view-button';
import { viewButtonCity } from "src/common/helpers/view-button";

import localse from "../../common/locales/text.json";


@Injectable()
@Wizard('question_scene')
export class QuestionScene {
  constructor(
    private readonly startServis: StartServise,
    private readonly cityServise: CityService,
    private readonly questionService: QuestionService
  ) { }

  async resetScene(ctx: any) {
    if (ctx?.update?.message?.text == '/start') {
      await ctx.scene.leave()
      await this.startServis.start(ctx);
      await sendMainMenu(ctx);

      return true;
    }

    return false;
  }

  @WizardStep(0)
  async onEnter(
    @Ctx() ctx: any,
  ) {
    const isStart = await this.resetScene(ctx);

    if (isStart) {
      return;
    }

    const input = ctx?.update?.message?.text;

    if (input === localse.cancelQuestion) {
      await ctx.scene.leave();
      await sendMainMenu(ctx, localse.canselQuestionSuccessfull);
      return;
    }

    if (!input || input == '/start') {
      return;
    }

    await ctx.reply(localse.textQuesion,
      Markup.keyboard([
        [localse.cancelQuestion]
      ])
        .resize()
        .oneTime()
    );

    await ctx.wizard.next();
  }

  @WizardStep(1)
  async quantity(
    @Ctx() ctx: any,
  ) {
    const isStart = await this.resetScene(ctx);

    if (isStart) {
      return;
    }

    const input = ctx?.update?.message?.text;

    if (input === localse.cancelQuestion) {
      await ctx.scene.leave();
      await sendMainMenu(ctx, localse.canselQuestionSuccessfull);
      return;
    }

    if (!input || input == '/start') {
      return;
    }

    ctx.scene.state.questionText = input;

    try {
      const cities = await this.cityServise.getCities();
      const buttons = viewButtonCity({ cities, key: "cityquan" })

      await ctx.reply(localse.chooseCity, {
        reply_markup: {
          inline_keyboard: buttons
        }
      });
    } catch (error) {
      console.error('Помилка при завантаженні міст в запитаннях:', error);

      await ctx.reply(localse.errors.getCities);
    }

    await ctx.wizard.next();
  }

  @WizardStep(2)
  async nameTeam(
    @Ctx() ctx: any,
  ) {
    const isStart = await this.resetScene(ctx);

    if (isStart) {
      return;
    }

    const input = ctx?.update?.message?.text;

    if (input === localse.cancelQuestion) {
      await ctx.scene.leave();
      await sendMainMenu(ctx, localse.canselQuestionSuccessfull);
      return;
    }

    if (!input || input == '/start') {
      return;
    }

    ctx.scene.state.nameTeam = input;

    await ctx.reply(localse.shareData, {
      reply_markup: {
        keyboard: [
          [
            {
              text: localse.shareContact,
              request_contact: true
            },
            {
              text: localse.cancelQuestion,
            }
          ]
        ],
        resize_keyboard: true,
        one_time_keyboard: true
      }
    });

    await ctx.wizard.next();
  }

  @WizardStep(3)
  async contact(
    @Ctx() ctx: any,
  ) {
    const isStart = await this.resetScene(ctx);

    if (isStart) {
      return;
    }

    const contact = ctx.update.message?.contact;

    if (!contact) {
      await ctx.reply(localse.needToPressData);

      return;
    }
    try {
      const { phone_number, first_name } = contact;
      const chatId = `${ctx.update?.callback_query?.from?.id || ctx.update?.message.from.id}`;
      const username = ctx.from?.username;

      const create = await this.questionService.createQuestion({
        chatId: `${chatId}`,
        nickname: `@${username}`,
        name: first_name,
        phone: phone_number,
        cityId: +ctx.scene.state.cityId,
        team: ctx.scene.state.nameTeam,
        question: ctx.scene.state.questionText,
        answer: '-'
      });

      if (!create?.data?.isAdd) {
        await ctx.reply(localse.errors.dontSaveQuestion);
        await ctx.scene.leave();
        console.error("Помилка в ввідправці запитання");

        return;
      }

      await ctx.reply(localse.questionSuccessful);
      await ctx.scene.leave();
    } catch (error) {
      console.log(error);
      await ctx.reply(localse.errors.dontSaveQuestion);
      await ctx.scene.leave();
      console.error("Помилка в ввідправці запитання");
    }
  }


  @Action(/cityquan_\d+/)
  async onGameRegister(@Ctx() ctx: any) {
    const callbackData = ctx.update?.callback_query?.data;
    const cityId = callbackData.split('_')[1];

    ctx.scene.state.cityId = cityId;

    await ctx.reply(localse.nameTeam);

    await ctx.answerCbQuery();
    await ctx.wizard.selectStep(2);
  }
}