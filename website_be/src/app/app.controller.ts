import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController { 
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello() {
    return { message: 'Hello GDG KU' };
  }
}
