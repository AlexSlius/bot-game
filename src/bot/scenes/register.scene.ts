import { Injectable } from '@nestjs/common';
import { Action, Ctx, Wizard, WizardStep } from 'nestjs-telegraf';

import { TeamService } from "src/team/team.service";
import { StartServise } from 'src/bot/servises/start';
import { ReminderService } from 'src/bot/servises/reminder.service'
import { sendMainMenu } from 'src/common/helpers/view-button';

import localse from "../../common/locales/text.json";


@Injectable()
@Wizard('register_scene') // замість @Scene
export class RegisterScene {
  constructor(
    private readonly teamServise: TeamService,
    private readonly startServis: StartServise,
    private readonly reminderService: ReminderService
  ) { }

  async registerFunction(state: any, ctx: any, isBtn = false) {
    const chatId = `${ctx.update?.callback_query?.from?.id || ctx.update?.message.from.id}`;

    try {
      const username = `${ctx.update?.callback_query?.from?.username || ctx.update?.message.from.username}`;

      const datanew = await this.teamServise.createTeam({
        name: state?.teamName || '-',
        captain: state?.captain || "-",
        phone: `${state.phoneNumber}`,
        chatId: chatId,
        nickname: `@${username}`,
        gameId: +state.gameId,
        cityId: +state.cityId,
        players: state.quantity,
        playersNew: 0,
        statusId: 1,
        wish: state?.wish || '',
        note: '',
      });

      if (!datanew?.data?.isAdd) {
        await ctx.reply(localse.unSuccessfullRegister, {
          reply_markup: {
            remove_keyboard: true
          }
        });
      }

      if (!!datanew.data.isAdd) {
        await sendMainMenu(ctx, localse.successfullRegister);
      }

      if (isBtn)
        await ctx.answerCbQuery();

      this.reminderService.clearReminder(chatId);
      sendMainMenu(ctx);
      await ctx.scene.leave();
    } catch (error) {
      console.error("Помилка при реєстрації на гру в registerFunction");

      await ctx.reply(localse.unSuccessfullRegister, {
        reply_markup: {
          remove_keyboard: true
        }
      });

      this.reminderService.clearReminder(chatId);

      if (isBtn)
        await ctx.answerCbQuery();

      sendMainMenu(ctx);
      await ctx.scene.leave();
    }
  }

  async resetScene(ctx: any) {
    if (ctx?.update?.message?.text == '/start') {
      const chatId = `${ctx.update?.callback_query?.from?.id || ctx.update?.message.from.id}`;
      this.reminderService.clearReminder(chatId);
      await ctx.scene.leave()
      await this.startServis.start(ctx);
      await sendMainMenu(ctx, localse.menu);

      return true;
    }

    return false;
  }

  async cancelScene(ctx: any, input: string) {
    if (input === localse.cancelButton) {
      await ctx.scene.leave();
      await sendMainMenu(ctx, localse.canselRegisterSuccessfull);

      const chatId = `${ctx.update?.callback_query?.from?.id || ctx.update?.message.from.id}`;
      this.reminderService.clearReminder(chatId);

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

    const chatId = ctx?.update?.callback_query?.from.id;

    if (chatId) {
      const lastTeam = await this.teamServise.findLast(chatId);

      if (!lastTeam?.id) {
        await ctx.reply(localse.nameTeam, {
          reply_markup: {
            keyboard: [
              [
                {
                  text: localse.cancelButton,
                },
              ]
            ],
            resize_keyboard: true,
            one_time_keyboard: true
          }
        });

        await ctx.wizard.next();
      }

      if (!!lastTeam?.id) {
        ctx.scene.state.teamName = lastTeam.name;
        ctx.wizard.state.captain = lastTeam.captain;
        ctx.wizard.state.phoneNumber = lastTeam.phone;
        ctx.wizard.state.firstName = lastTeam.nickname;

        await ctx.reply("...", {
          reply_markup: {
            keyboard: [
              [
                {
                  text: localse.cancelButton,
                },
              ]
            ],
            resize_keyboard: true,
            one_time_keyboard: true
          }
        });

        await ctx.reply(localse.nameTeamCurrent.replace('${name}', lastTeam.name), {
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: localse.currentNameTeam,
                  callback_data: `keep_name_team`
                },
                {
                  text: localse.newNameTeam,
                  callback_data: `new_name_team`
                },
              ],
            ]
          }
        });
      }
    }
  }

  // steps
  @WizardStep(1)
  async quantity(
    @Ctx() ctx: any,
  ) {
    const isStart = await this.resetScene(ctx);

    if (isStart) {
      return;
    }

    const chatId = ctx?.update?.callback_query?.from?.id || ctx?.update?.message?.from?.id

    if (chatId) {
      this.reminderService.setReminder(chatId, async () => {
        await ctx.telegram.sendMessage(chatId, localse.nextRegister)
      });
    }

    const input = ctx?.update?.message?.text;

    const status = await this.cancelScene(ctx, input);

    if (status)
      return;

    if (input?.length < 2) {
      await ctx.reply(localse.minNameLen);

      return;
    }

    if (!input || input == '/start') {
      return;
    }

    await ctx.reply(localse.quantityPlayers);

    ctx.scene.state.teamName = input;

    await ctx.wizard.next();
  }

  @WizardStep(2)
  async captain(
    @Ctx() ctx: any,
  ) {
    const isStart = await this.resetScene(ctx);

    if (isStart) {
      return;
    }

    const input = ctx?.update?.message?.text;

    const status = await this.cancelScene(ctx, input);

    if (status)
      return;

    if (!input || input == '/start') {
      return;
    }

    const number = parseInt(input, 10);

    if (isNaN(number) || number < 4 || number > 10) {
      await ctx.reply(localse.textLimitPlayers);

      return;
    }

    ctx.wizard.state.quantity = number;

    if (!!ctx.wizard.state.captain?.length) {
      await ctx.reply("...", {
        reply_markup: {
          keyboard: [
            [
              {
                text: localse.cancelButton,
              },
            ]
          ],
          resize_keyboard: true,
          one_time_keyboard: true
        }
      });

      await ctx.reply(localse.deside, {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: localse.yes,
                callback_data: `deside_yes`
              },
              {
                text: localse.no,
                callback_data: `deside_no`
              },
            ]
          ]
        }
      });

      await ctx.wizard.selectStep(5);
    }

    if (!ctx.wizard.state.captain?.length) {
      await ctx.reply(localse.nameCaptain);
      await ctx.wizard.next();
    }
  }

  @WizardStep(3)
  async contact(
    @Ctx() ctx: any,
  ) {
    const isStart = await this.resetScene(ctx);

    if (isStart) {
      return;
    }

    if (!ctx.wizard.state.captain?.length) {
      const input = ctx.update.message?.text;

      const status = await this.cancelScene(ctx, input);

      if (status)
        return;

      if (!input || input == '/start') {
        return;
      }

      ctx.wizard.state.captain = input;

      await ctx.reply(localse.phoneNumber, {
        reply_markup: {
          keyboard: [
            [
              {
                text: localse.shareContact,
                request_contact: true
              },
              {
                text: localse.cancelButton,
              },
            ]
          ],
          resize_keyboard: true,
          one_time_keyboard: true
        }
      });
    }

    await ctx.wizard.next();
  }

  @WizardStep(4)
  async wish(
    @Ctx() ctx: any,
  ) {
    const isStart = await this.resetScene(ctx);

    if (isStart) {
      return;
    }

    const contact = ctx.update.message?.contact;

    if (contact) {
      const { phone_number, first_name, user_id } = contact;

      ctx.wizard.state.phoneNumber = phone_number;
      ctx.wizard.state.firstName = first_name;
      ctx.wizard.state.userId = user_id;
    }

    if (!contact) {
      const input = ctx.update?.message?.text;

      const status = await this.cancelScene(ctx, input);

      if (status)
        return;

      if (!input || input == '/start') {
        return;
      }

      const isValid = /^\+380\d{9}$/.test(input);

      if (!isValid) {
        await ctx.reply(localse.phoneNumber);

        return;
      }

      await ctx.reply("...", {
        reply_markup: {
          keyboard: [
            [
              {
                text: localse.cancelButton,
              },
            ]
          ],
          resize_keyboard: true,
          one_time_keyboard: true
        }
      });

      ctx.wizard.state.phoneNumber = input;
    }

    await ctx.reply("...", {
      reply_markup: {
        keyboard: [
          [
            {
              text: localse.cancelButton,
            },
          ]
        ],
        resize_keyboard: true,
        one_time_keyboard: true
      }
    });

    await ctx.reply(localse.deside, {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: localse.yes,
              callback_data: `deside_yes`
            },
            {
              text: localse.no,
              callback_data: `deside_no`
            },
          ]
        ]
      }
    });

    await ctx.wizard.next();
  }

  @WizardStep(5)
  async finalStep(@Ctx() ctx: any) {
    const isStart = await this.resetScene(ctx);

    if (isStart) {
      return;
    }

    if (ctx.update?.callback_query?.data == 'deside_yes') {
      return;
    }

    const input = ctx.update.message?.text;

    const status = await this.cancelScene(ctx, input);

    if (status)
      return;

    if (!input || input == '/start') {
      return;
    }

    if (input) {
      ctx.wizard.state.wish = input;
    } else {
      ctx.wizard.state.wish = '';
    }

    await this.registerFunction(ctx.wizard.state, ctx);
  }

  // actions
  @Action('keep_name_team')
  async keepName(
    @Ctx() ctx: any,
  ) {
    await ctx.answerCbQuery();
    await ctx.reply(localse.quantityPlayers);
    await ctx.wizard.selectStep(2);
  }

  @Action('new_name_team')
  async newName(
    @Ctx() ctx: any,
  ) {
    await ctx.answerCbQuery();
    await ctx.reply(localse.writeNewNameTeam);
    await ctx.wizard.selectStep(1);
  }

  @Action('deside_yes')
  async handleYes(
    @Ctx() ctx: any,
  ) {
    await ctx.reply(localse.writeDeside);

    await ctx.answerCbQuery();
    await ctx.wizard.selectStep(5);
  }

  @Action('deside_no')
  async handleNo(@Ctx() ctx: any) {
    await this.registerFunction(ctx.wizard.state, ctx, true);
  }
}
