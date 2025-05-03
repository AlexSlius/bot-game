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
@Wizard('cansel_game_scene')
export class CanselGameScene {
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

      return;
    }
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
    await this.resetScene(ctx);

    const input = ctx?.update?.message?.text;

    const status = await this.cancelScene(ctx, input);

    if (status) {
      return;
    }

    const chatId = ctx?.update?.message?.from?.id;
    const games = await this.gameService.getMyGame(chatId, 1) || [];

    if (games?.length) {
      const buttons = viewButtonGame({ games, key: "cansel", keqBack: "back_to_city_cen" });

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

  @Action(/cansel_\d+/)
  async onGameRegister(@Ctx() ctx: any) {
    const callbackData = ctx.update?.callback_query?.data;
    const chatId = ctx?.update?.callback_query?.from?.id || ctx?.update?.message?.from?.id
    const gameId = callbackData.split('_')[1];

    try {
      const resUpdate = await this.teamServise.update({
        gameId: +gameId,
        chatId: `${chatId}`,
        statusId: 5,
      });

      if (!resUpdate?.data?.isUpdate) {
        await ctx.reply(localse.errors.dontCancel);
      }

      await ctx.scene.leave();

      if (resUpdate.data.isUpdate) {
        await ctx.reply(localse.cancelSuccessful);
      }

      await ctx.answerCbQuery();
    } catch (error) {
      console.error("Не вийшло скасувати гру");
      await ctx.reply(localse.errors.dontCancel);
      await ctx.scene.leave();
    }
  }

  @Action('back_to_city_cen')
  async handleBack(
    @Ctx() ctx: any,
  ) {
    await this.actionCityServise.backToCityList(ctx)

    await ctx.answerCbQuery();
    await ctx.scene.leave();
  }
}