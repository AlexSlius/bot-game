
import { Module } from '@nestjs/common';

import { BotUpdate } from './bot.update';
import { StartServise } from './servises/start';
import { CityModule } from 'src/city/city.module';
import { ActionCityServise } from './servises/action-city';
import { GameModule } from 'src/game/game.module';
import { ActionGameServise } from './servises/action-game';
import { TeamModule } from 'src/team/team.module';
import { RegisterScene } from './scenes/register.scene';
import { ReminderService } from 'src/bot/servises/reminder.service' 
import { UpdateQuantityScene } from './scenes/update.quantity';
import { CanselGameScene } from './scenes/cansel.scene';
import { QuestionScene } from './scenes/question.scene';
import { QuestionModule } from 'src/question/question.module';


@Module({
    imports: [
        CityModule,
        GameModule,
        TeamModule,
        QuestionModule,
    ],
    providers: [
        BotUpdate,
        StartServise,
        RegisterScene,
        UpdateQuantityScene,
        CanselGameScene,
        QuestionScene,
        ActionCityServise,
        ActionGameServise,
        ReminderService,
    ]
})

export class BotModule { }