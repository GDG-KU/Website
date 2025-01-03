import { Controller, Get, UseGuards, Req, Post, Body, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { GoogleAuthGuard } from './security/google.guard';
import { JwtAuthGuard } from './security/jwt.guard';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TokensResponseDto } from './dto/response/tokens.response.dto';
import { RefreshDto } from './dto/request/refresh.dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  @ApiOperation({ summary: '구글 OAuth 인증', description: '프론트에서 이 api로 접근해야 함.' })
  @UseGuards(GoogleAuthGuard)
  // redirect to google login page
  async googleAuth(){}

  @Get('google/callback')
  @ApiOperation({ summary: '구글 OAuth 인증 콜백', description: '구글 로그인 후 이 api로 리다이렉트 됨.' })
  @ApiResponse({ 
    description: '구글 로그인 성공',
    type: TokensResponseDto,
  })
  @UseGuards(GoogleAuthGuard)
  // get user info from google
  async googleAuthRedirect(@Req() req, @Res({ passthrough: true }) res: Response){
    // access token, refresh token 반환
    const {access_token, refresh_token} = await this.authService.googleCallback(req);
    
    // refresh token 쿠키에 저장
    res.cookie('refresh_token', refresh_token, { httpOnly: true});
    
    // access token 반환 (개발용으로 현재는 refresh token도 반환)
    return {access_token, refresh_token};
  }


  @Post('refresh')
  @ApiOperation({ summary: 'JWT 토큰 재발급', description: 'access token이 만료되면 이 api로 재발급 받아야 함.' })
  @ApiResponse({ 
    description: 'JWT 토큰 재발급 성공',
    type: TokensResponseDto,
  })
  // refresh token
  async refresh(@Body() refreshDto: RefreshDto, @Res({ passthrough: true }) res: Response){
    // refresh token 검증 후 access token, refresh token 재발급
    const {access_token, refresh_token}= await this.authService.refreshTokens(refreshDto.refresh_token)
    
    // refresh token 쿠키에 저장
    res.cookie('refresh_token', refresh_token, { httpOnly: true});
    
    // access token 반환 (개발용으로 현재는 refresh token도 반환)
    return {access_token, refresh_token};
  }

  @Get('api/test')
  @ApiOperation({ summary: '테스트 API', description: 'JWT 인증 테스트 api' })
  @ApiBearerAuth('token')
  @UseGuards(JwtAuthGuard)
  // test api
  getTest(@Req() req): string {
    const {user} = req;
    console.log(user.email);
    return 'success test';
  }
}