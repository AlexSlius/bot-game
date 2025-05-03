import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { QuestionService } from './question.service';

@Module({
    imports: [HttpModule],
    providers: [QuestionService],
    exports: [QuestionService]
})

export class QuestionModule { }
