import { Controller, UseGuards } from '@nestjs/common/decorators/core';
import { Get, Post, Request } from '@nestjs/common/decorators/http';
import { AppService } from './app.service';
import { LoginCredentialsDto } from './auth/dtos/login-credentials.dto';
import { LocalAuhGuard } from './auth/local-auth.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @UseGuards(LocalAuhGuard)
  @Post('login')
  login(@Request() req: LoginCredentialsDto): string {
    return req.username;
  }

  @Get('protected')
  getHello(@Request() req: LoginCredentialsDto): string {
    return req.username;
  }
}
