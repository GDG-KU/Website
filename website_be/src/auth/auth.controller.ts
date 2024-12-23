import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { GoogleAuthGuard } from './security/google.guard';
import { JwtAuthGuard } from './security/jwt.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  // redirect to google login page
  async googleAuth(){}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  // get user info from google
  googleAuthRedirect(@Req() req){
    return this.authService.googleCallback(req)
  }

  @Get('api/test')
  @ApiBearerAuth('token')
  @UseGuards(AuthGuard('jwt'))
  getTest(@Req() req): string {
    console.log(req.email);
    return 'success test';
  }
}
