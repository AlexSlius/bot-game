import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';

import { GeneralService } from './general.service';
import { GeneralController } from './general.controller';
import { AuthCrmGuard } from 'src/common/guards/auth-api';

@Module({
  controllers: [GeneralController],
  providers: [
    GeneralService,
    {
      provide: APP_GUARD,
      useClass: AuthCrmGuard
    }
  ],
})
export class GeneralModule { }
