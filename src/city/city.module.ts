import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { CityService } from './city.service';


@Module({
    imports: [HttpModule],
    providers: [CityService],
    exports: [CityService]
})

export class CityModule { }
