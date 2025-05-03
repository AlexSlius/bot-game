import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { TeamService } from './team.service';


@Module({
    imports: [HttpModule],
    providers: [TeamService],
    exports: [TeamService]
})

export class TeamModule { }
