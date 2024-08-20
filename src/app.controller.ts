import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    console.log('ENV HOST:', process.env.LOCAL_ENV_HOST);
    return this.appService.getHello();
  }
}
