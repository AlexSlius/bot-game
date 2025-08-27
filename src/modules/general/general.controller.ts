import { Controller, Post, Body } from '@nestjs/common';
import { GeneralService } from './general.service';

@Controller('general')
export class GeneralController {
  constructor(private readonly generalService: GeneralService) { }

  @Post('send-message')
  create(@Body() dataMessage:any) {
    return this.generalService.sendMessage(dataMessage);
  }
}
