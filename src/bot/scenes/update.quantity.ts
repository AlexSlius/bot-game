import { Injectable } from '@nestjs/common';
import { Action, Ctx, Wizard, WizardStep } from 'nestjs-telegraf';

import { TeamService } from "src/team/team.service";
import { StartServise } from 'src/bot/servises/start';
import { ActionCityServise } from 'src/bot/servises/action-city';
import { GameService } from 'src/game/game.service';
import { viewButtonGame } from 'src/common/helpers/view-button';
import { sendMainMenu } from 'src/common/helpers/view-button';

import localse from "../../common/locales/text.json";


@Injectable()
@Wizard('update_quantity_scene')
export class UpdateQuantityScene {
  constructor(
    private readonly teamServise: TeamService,
    private readonly gameService: GameService,
    private readonly startServis: StartServise,
    private readonly actionCityServise: ActionCityServise,
  ) { }

  async resetScene(ctx: any) {
    if (ctx?.update?.message?.text == '/start') {
      await ctx.scene.leave()
      await this.startServis.start(ctx);
      await sendMainMenu(ctx, localse.menu);

      return true;
    }

    return false;
  }

  async cancelScene(ctx: any, input: string) {
    if (input === localse.cancelButtonPrev) {
      await ctx.scene.leave();
      await sendMainMenu(ctx, localse.menu);

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

    const status = await this.cancelScene(ctx, input);

    if (status) {
      return;
    }

    const chatId = ctx?.update?.message?.from?.id;
    const games = await this.gameService.getMyGame(chatId, 1) || [];

    if (games?.length) {
      const buttons = viewButtonGame({ games });

      await ctx.reply(localse.chooseGame, {
        reply_markup: {
          keyboard: [
            [
              {
                text: localse.cancelButtonPrev,
              },
            ]
          ],
          resize_keyboard: true,
          one_time_keyboard: true
        }
      });

      await ctx.reply(localse.availableGame, {
        reply_markup: {
          inline_keyboard: buttons
        }
      });

    } else {
      await ctx.reply(localse.sorryDontHaveGame, {
        reply_markup: {
          keyboard: [
            [
              {
                text: localse.cancelButtonPrev,
              },
            ]
          ],
          resize_keyboard: true,
          one_time_keyboard: true
        }
      });
    }
  }

  // step 1
  @WizardStep(1)
  async quantity(
    @Ctx() ctx: any,
  ) {
    const isStart = await this.resetScene(ctx);

    if (isStart) {
      return;
    }

    const chatId = ctx?.update?.callback_query?.from?.id || ctx?.update?.message?.from?.id
    const input = ctx?.update?.message?.text;

    const status = await this.cancelScene(ctx, input);

    if (status) {
      return;
    }

    if (!input || input == '/start' || !chatId) {
      return;
    }

    const number = parseInt(input, 10);

    if (isNaN(number) || number < 4 || number > 10) {
      await ctx.reply(localse.textLimitPlayers);

      return;
    }

    try {
      const resUpdate = await this.teamServise.update({
        gameId: +ctx.scene.state.gameId,
        chatId: `${chatId}`,
        playersNew: number,
      });

      if (!resUpdate?.data?.isUpdate) {
        await sendMainMenu(ctx, localse.errors.dontSaveQuantity);
      }

      if (resUpdate.data.isUpdate) {
        await sendMainMenu(ctx, localse.quanEditSuccessful);
      }

      await ctx.scene.leave();
    } catch (error) {
      console.error("Не вийшло зберегти нову кількість в грі");
      await sendMainMenu(ctx, localse.errors.dontSaveQuantity);
      await ctx.scene.leave();
    }
  }

  @Action(/quantity_\d+/)
  async onGameRegister(@Ctx() ctx: any) {
    const callbackData = ctx.update?.callback_query?.data;
    const gameId = callbackData.split('_')[1];

    ctx.scene.state.gameId = gameId;

    await ctx.reply(localse.textLimitPlayers);

    await ctx.answerCbQuery();
    await ctx.wizard.selectStep(1);
  }

  @Action('back_to_city_qun')
  async handleBack(
    @Ctx() ctx: any,
  ) {
    await this.actionCityServise.backToCityList(ctx)

    await ctx.answerCbQuery();
    await ctx.scene.leave();
  }
}